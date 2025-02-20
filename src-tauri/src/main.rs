#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

use sea_orm::{Database, DatabaseConnection, DbErr, EntityTrait, ActiveModelTrait, Set, ColumnTrait, QueryFilter};
use sea_orm_migration::{SchemaManager, prelude::*};
use tauri::State;
use argon2::{Argon2, PasswordHasher, PasswordVerifier, password_hash::{SaltString, rand_core::OsRng, PasswordHash}};

mod user_entity {
    use sea_orm::entity::prelude::*;

    #[derive(Clone, Debug, PartialEq, DeriveEntityModel)]
    #[sea_orm(table_name = "users")]
    pub struct Model {
        #[sea_orm(primary_key)]
        pub id: i32,
        pub username: String,
        pub password_hash: String,
    }

    #[derive(Copy, Clone, Debug, EnumIter)]
    pub enum Relation {}

    impl RelationTrait for Relation {
        fn def(&self) -> RelationDef {
            panic!("No relations defined")
        }
    }

    impl ActiveModelBehavior for ActiveModel {}
}

use user_entity as entity;

#[derive(Iden)]
enum Users {
    Table,
    Id,
    Username,
    PasswordHash,
}

async fn run_migration(db: &DatabaseConnection) -> Result<(), DbErr> {
    let schema_manager = SchemaManager::new(db);
    
    schema_manager
        .create_table(
            Table::create()
                .table(Users::Table)
                .if_not_exists()
                .col(ColumnDef::new(Users::Id)
                    .integer()
                    .not_null()
                    .auto_increment()
                    .primary_key())
                .col(ColumnDef::new(Users::Username).string().not_null().unique_key())
                .col(ColumnDef::new(Users::PasswordHash).string().not_null())
                .to_owned(),
        )
        .await?;
        
    Ok(())
}

#[tauri::command]
async fn register(
    username: &str,
    password: &str,
    state: State<'_, DatabaseConnection>,
) -> Result<String, String> {
    // Check if username already exists
    let existing_user = entity::Entity::find()
        .filter(entity::Column::Username.eq(username))
        .one(state.inner())
        .await
        .map_err(|e| e.to_string())?;

    if existing_user.is_some() {
        return Err("Username already taken".into());
    }

    // Hash password
    let salt = SaltString::generate(&mut OsRng);
    let argon2 = Argon2::default();
    let password_hash = argon2
        .hash_password(password.as_bytes(), &salt)
        .map_err(|e| e.to_string())?
        .to_string();

    // Create new user
    let new_user = entity::ActiveModel {
        username: Set(username.to_string()),
        password_hash: Set(password_hash),
        ..Default::default()
    };

    entity::Entity::insert(new_user)
        .exec(state.inner())
        .await
        .map_err(|e| e.to_string())?;

    Ok(format!("User {} registered successfully!", username))
}

#[tauri::command]
async fn login(
    username: &str,
    password: &str,
    state: State<'_, DatabaseConnection>,
) -> Result<String, String> {
    // Find user by username
    let user = entity::Entity::find()
        .filter(entity::Column::Username.eq(username))
        .one(state.inner())
        .await
        .map_err(|e| e.to_string())?
        .ok_or_else(|| "User not found".to_string())?;

    // Verify password
    let parsed_hash = PasswordHash::new(&user.password_hash)
        .map_err(|e| e.to_string())?;
    Argon2::default()
        .verify_password(password.as_bytes(), &parsed_hash)
        .map_err(|_| "Invalid password".to_string())?;

    Ok(format!("Welcome back {}!", user.username))
}

#[tokio::main]
async fn main() {
    let db_url = "mysql://root:@localhost:3306/tpa_desktop";
    let db = Database::connect(db_url)
        .await
        .expect("Failed to connect to database");

    run_migration(&db)
        .await
        .expect("Failed to run migration");
    
    println!("Migration completed successfully!");

    tauri::Builder::default()
        .manage(db)
        .invoke_handler(tauri::generate_handler![register, login])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
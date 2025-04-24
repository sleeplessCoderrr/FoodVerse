/*
Copyright © 2025 NAME HERE <EMAIL ADDRESS>
*/
package cmd

import (
    "fmt"
    "os"
    "path/filepath"
    "strings"
    "text/template"

    "github.com/spf13/cobra"
)

// makeCmd represents the make command
var makeCmd = &cobra.Command{
    Use:   "make [entity]",
    Short: "Generate boilerplate code for a model and repository",
    Long: `Generate a GORM model + repository interface & stub implementation
for the named entity. Example:

  yourcli make product
`,
    Args: cobra.MinimumNArgs(1),
    Run: func(cmd *cobra.Command, args []string) {
        entity := strings.Title(args[0])
        fmt.Printf("Generating files for %q…\n", entity)

        if err := createModel(entity); err != nil {
            fmt.Println(" ✗ model:", err)
            os.Exit(1)
        }
        fmt.Println(" ✓ models/" + strings.ToLower(entity) + ".go")

        if err := createRepository(entity); err != nil {
            fmt.Println(" ✗ repository:", err)
            os.Exit(1)
        }
        fmt.Println(" ✓ repository/" + strings.ToLower(entity) + "_repository.go")

        fmt.Println("Done!")
    },
}

func init() {
    rootCmd.AddCommand(makeCmd)
}

// createModel writes models/<entity>.go
func createModel(name string) error {
    modelDir := "internal/model"
    if err := os.MkdirAll(modelDir, 0755); err != nil {
        return err
    }
    filePath := filepath.Join(modelDir, strings.ToLower(name)+".go")
    const tpl = `package model

import "gorm.io/gorm"

type {{.Name}} struct {
	gorm.Model
    // TODO: add your fields
}
`
    return writeTemplatedFile(filePath, tpl, name)
}

// createRepository writes repository/<entity>_repository.go
func createRepository(name string) error {
    repoDir := "internal/repository"
    if err := os.MkdirAll(repoDir, 0755); err != nil {
        return err
    }
    filePath := filepath.Join(repoDir, strings.ToLower(name)+"_repository.go")
    const tpl = `package repository

import (
	"github.com/sleeplessCoderrr/FoodVerse/internal/model"
	"gorm.io/gorm"
)

// {{.Name}}RepositoryImpl implements {{.Name}}Repository using GORM
type {{.Name}}Repository struct {
    db *gorm.DB
}

func New{{.Name}}Repository(db *gorm.DB) *{{.Name}}Repository {
    return &{{.Name}}Repository{db: db}
}

func (r *{{.Name}}Repository) Create{{.Name}}(m *model.{{.Name}}) error {
	return r.db.Create(m).Error
}
`
    return writeTemplatedFile(filePath, tpl, name)
}

// writeTemplatedFile writes a parsed Go template to disk
func writeTemplatedFile(path, tmplStr, name string) error {
    t := template.Must(template.New("tmpl").Parse(tmplStr))
    f, err := os.Create(path)
    if err != nil {
        return err
    }
    defer f.Close()
    return t.Execute(f, struct{ Name string }{Name: name})
}

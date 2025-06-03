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
	"github.com/FoodVerse/FoodVerse-backend/internal/model"
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

func (r *{{.Name}}Repository) Find{{.Name}}ById(id uint) (*model.{{.Name}}, error) {
    var m model.{{.Name}}
    err := r.db.First(&m, id).Error
    if err != nil {
        return nil, err
    }
    return &m, nil
}

func (r *{{.Name}}Repository) Update{{.Name}}(m *model.{{.Name}}) error {
    return r.db.Save(m).Error
}

func (r *{{.Name}}Repository) Delete{{.Name}}ById(id uint) error {
    return r.db.Delete(&model.{{.Name}}{}, id).Error
}

func (r *{{.Name}}Repository) GetAll{{.Name}}s() ([]model.{{.Name}}, error) {
    var ms []model.{{.Name}}
    err := r.db.Find(&ms).Error
    if err != nil {
        return nil, err
    }
    return ms, nil
}
`
	return writeTemplatedFile(filePath, tpl, name)
}

func createController(name string) error {
	controllerDir := "internal/controller"
	if err := os.MkdirAll(controllerDir, 0755); err != nil {
		return err
	}
	filePath := filepath.Join(controllerDir, strings.ToLower(name)+"_controller.go")
	const tpl = `package controller
import (
    "net/http"
    "github.com/gin-gonic/gin"
    "github.com/FoodVerse/FoodVerse-backend/internal/model"
    "github.com/FoodVerse/FoodVerse-backend/internal/service"
)

type {{.Name}}Controller struct {
    {{.Name}}Service *service.{{.Name}}Service
}

func New{{.Name}}Controller({{.Name}}Service *service.{{.Name}}Service) *{{.Name}}Controller {
    return &{{.Name}}Controller{
        {{.Name}}Service: {{.Name}}Service,
    }
}

func (c *{{.Name}}Controller) Create{{.Name}}(ctx *gin.Context) {
    var input model.{{.Name}}Input
    if err := ctx.ShouldBindJSON(&input); err != nil {
        ctx.JSON(http.StatusBadRequest, gin.H{
            "error": err.Error(),
        })
        return
    }
    {{.Name}}Response, err := c.{{.Name}}Service.Create{{.Name}}(&input)
    if err != nil {
        ctx.JSON(http.StatusBadRequest, gin.H{
            "error": err.Error(),
        })
        return
    }
    ctx.JSON(http.StatusCreated, {{.Name}}Response)
}

func (c *{{.Name}}Controller) Get{{.Name}}(ctx *gin.Context) {  
    id := ctx.Param("id")
    {{.Name}}, err := c.{{.Name}}Service.Get{{.Name}}(id)
    if err != nil {
        ctx.JSON(http.StatusNotFound, gin.H{
            "error": err.Error(),
        })
        return
    }
    ctx.JSON(http.StatusOK, {{.Name}})
}

func (c *{{.Name}}Controller) Update{{.Name}}(ctx *gin.Context) {
    id := ctx.Param("id")
    var input model.{{.Name}}Input
    if err := ctx.ShouldBindJSON(&input); err != nil {
        ctx.JSON(http.StatusBadRequest, gin.H{
            "error": err.Error(),
        })
        return
    }
    {{.Name}}Response, err := c.{{.Name}}Service.Update{{.Name}}(id, &input)
    if err != nil {
        ctx.JSON(http.StatusBadRequest, gin.H{
            "error": err.Error(),
        })
        return
    }
    ctx.JSON(http.StatusOK, {{.Name}}Response)
}

func (c *{{.Name}}Controller) Delete{{.Name}}(ctx *gin.Context) {
    id := ctx.Param("id")
    err := c.{{.Name}}Service.Delete{{.Name}}(id)
    if err != nil {
        ctx.JSON(http.StatusNotFound, gin.H{
            "error": err.Error(),
        })
        return
    }
    ctx.JSON(http.StatusNoContent, nil)
}

func (c *{{.Name}}Controller) GetAll{{.Name}}s(ctx *gin.Context) {
    {{.Name}}s, err := c.{{.Name}}Service.GetAll{{.Name}}s()
    if err != nil {
        ctx.JSON(http.StatusInternalServerError, gin.H{
            "error": err.Error(),
        })
        return
    }
    ctx.JSON(http.StatusOK, {{.Name}}s)
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

J.A Rio Militar - MONOLITIC ERP SYSTEM

1 - Ferramentas que estão sendo utilizadas no projeto:

Para o Front End

	EJS, CSS, JAVASCRIPT e JQUERY

Para o Back End

	NodeJS

Para Banco de Dados
	
	MySQL

--------------------------------------------------

erp
	app
		controller
		models
		routes
		view
	bin
		www
	config
		database configuration
		library.js
		user connection (by Passport); 
	node_modules
		node modules used by the application
	public
		images
		javascript front-end codes (ajax and DOM manipulation)
	.env
	app.js
	package.json
	REAME.md


Caminho da ação do usuário até o retorno

View -> Route -> Controller -> Model -> Controller -> View

--------------------------------------------------

Caminho da ação do usuário para 'Home Page'

Rota: '/' | (app/routes/)

Função: homeController.index

render: view/index

---------------------------------------------------

Caminho para 'Listar Produtos'

Clica em listar produtos na página de produtos (view)

Chama a Rota /product/list que chama (route)

A função productController.list que irá realizar todas as solicitações aos models (controller)

no caso buscará no model Product.list que irá retornar ao controller os produtos (model)

O controller irá enviar para o view os produtos retornados (controller)

Recebe a solicitação do Controller 'view/product/index' (view)


---------------------------------------------------

Novas funcionalidades a implementar - 

Finish product manage functions

Create Production requests
	Create production products amount controller by status

fix feedstock create and edit

Rework function to verify access;
Financial filter by user;
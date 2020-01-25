let express = require("express");
let morgan = require("morgan");
let uuid = require("uuid/v4");
let bodyParser = require("body-parser");
let jsonParser = bodyParser.json();
let app = express();

app.use(express.static("public"));
app.use(morgan("dev"));



let comentarios = [{
    id : "123",
    titulo : "Titulo1",
    contenido: "contenido1",
    autor: "Alix",
    fecha: Date()

},{
    id : uuid(),
    titulo : "Titulo2",
    contenido: "contenido2",
    autor: "Fernando",
    fecha: Date()

},{
    id : uuid(),
    titulo : "Titulo3",
    contenido: "contenido3",
    autor: "Elisa",
    fecha: Date()

}];


app.get("/blog-api/comentarios", (req,res) =>{
    console.log(req);
    return res.status(200).json(comentarios);
});

app.get("/blog-api/comentarios-por-autor", (req,res) =>{
    let autor = req.query.autor;

    let result = comentarios.filter( (elements ) => {
        if(elements.autor == autor){
            return elements;
        }
    }); 

    if (autor){
        if(result){
            return res.status(200).json(result);

        }else{
            return res.status(404).send("Este autor no tiene comentarios");
        }
        
    }else{
        return res.status(406).send("No se administro correctamente el autor");
    };
});

app.post("/blog-api/nuevo-comentario" , jsonParser , (req, res) =>{
    let comentario = req.body;
    let titulo = req.body.titulo;
    let contenido = req.body.contenido;
    let autor = req.body.autor;
  
    if(titulo != null && contenido != null && autor != null){
        comentario.id = uuid();
        comentario.fecha = Date();
        comentarios.push(comentario);
        console.log(req.body);
        return res.status(201).json(comentario);
    }else {
        return res.status(406).send("Falta algun Elemento");
    }
});

app.delete("/blog-api/remover-comentario/:id", jsonParser, (req, res)=>{
    let id = req.params.id;

    let result = comentarios.find( ( elements ) => {
        if(elements.id == id){
            return elements;
        }
    }); 

    if (result){
        comentarios = comentarios.filter((elements) =>{
            if(elements.id != result.id){
                return elements;
            }
        });

        return res.status(200).send("Comentario Eliminado");

    } else {
        return res.status(404).send("No existe el ID");
    };
});

app.put("/blog-api/actualizar-comentario/:id", jsonParser , (req,res) =>{
    let idBody = req.body.id;
    let idParam = req.params.id;
    let titulo = req.body.titulo;
    let contenido = req.body.contenido;
    let autor = req.body.autor;

    if(idBody != null && idBody != ""){
        if(idBody == idParam){
            if(titulo != null || contenido != null || autor != null){
                let result = comentarios.find( ( elements ) => {
                    if(elements.id == idBody){
                        if(titulo != null){
                            return elements.titulo = titulo;
                        } 
                        if(contenido != null){
                            return elements.contenido = contenido;
                        }
                        if(autor != null){
                            return elements.autor = autor;
                        }
                    }
                })
                return res.status(202).json(result);                   
            }else{
                return res.status(406).send("No hay ningun campo a actualizar");
            };
        }else{
            return res.status(409).send("Los id del cuerpo y parametro no son los mismos");
        };
    } else{
        return res.status(406).send("Falta administrar el id en el cuerpo");
    };
});



app.listen(8080, () =>{
    console.log("Servidor corriendo en puerto 8080");
});
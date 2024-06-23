const express = require('express')
const fs = require('fs')
const PORT = 3000
const app = express();

app.use(express.json());


//crear ruta
app.get('/', (req, res) => {
    res.sendFile(__dirname + '/index.html') //comando para agregar un archivo html
})

//crear
app.post('/canciones', (req, res) => {
    try {
        const song = req.body //por body se pasa un objetos {id, titulo, artista, tono}
        const songs = JSON.parse(fs.readFileSync('repertorio.json', 'utf8')); // leo el archivo
        songs.push(song);
        console.log(song); //se sugiere este console.log para ver que hay en este punto
        fs.writeFileSync('repertorio.json', JSON.stringify(songs));
        res.status(201).send('cancion creada con exito')

    } catch (error) {
        res.status(500).json({message:'La canción no se creo'})
    }
})

//leer
app.get('/canciones', (req, res) => {
    try {
        const songs = JSON.parse(fs.readFileSync('repertorio.json', 'utf8')); // leo el archivo
        res.status(200).json(songs)
    } catch (error) {
        res.status(500).json({message:'El recurso no esta disponible'})
    }
})


//editar

app.put("/canciones/:id", (req, res) => {
    try {
        const { id } = req.params
        const song = req.body
        const songs = JSON.parse(fs.readFileSync("repertorio.json")) 
        const index = songs.findIndex(p => p.id == id) 
        songs[index] = song
        fs.writeFileSync("repertorio.json", JSON.stringify(songs))
        res.status(201).send("Canción modificada con éxito")
       
    
    } catch (error) {
        res.status(404).send('Canción no encontrada');
    }
})
   

//borrar
app.delete('/canciones/:id', (req, res) => {

    try {
       // const song = req.body //por body se pasa un objetos {id, titulo, artista, tono}
        const id = req.params.id;
        const songs = JSON.parse(fs.readFileSync('repertorio.json', 'utf8')); // leo el archivo
        const cancion = songs.find(e => e.id === id)
        songs.splice(cancion,1)
        fs.writeFileSync('repertorio.json', JSON.stringify(songs));
        res.status(201).send('cancion borrada con exito')

    } catch (error) {
        res.status(500).json({message:'La canción no fue borrada'})  
    }
    
});


//ruta para cuando se escriba cualquier otra ruta que no sean las definidas
app.all('*', (req, res) => {
    res.status(404).send('Ruta no encontrada');
})


app.listen(PORT, console.log(`🚨servidor activado🚨 http://localhost:${PORT}` ));



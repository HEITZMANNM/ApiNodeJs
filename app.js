const express = require('express');
const axios = require('axios');
const http = require('http');

const app = express();


let listeUser = [
    {id: 1, nom: 'Dupont', email: 'Jean@hotmail.fr'},
    {id: 2, nom: 'Durand', email: 'Paul@gmail.com'},
    {id: 3, nom: 'Dujardin', email: 'Jean@gmail.fr'}
];

const host = 'localhost';
const port = 5000;

app.listen(port, host, () => {
    console.log(`Server is running on http://${host}:${port}`);
});

app.get('/api/users', (req, res) => {
    res.json({message: "liste des utilisateurs :", users: listeUser});
});


app.get('/api/users/:id', (req, res) => {
    const userid = req.params.id;
    const user = listeUser.find(u => u.id == userid);
    if (user) {
        res.json(user);
    } else {
        res.status(404).end('Utilisateur non trouvé');
    }
});

app.use(express.json()); 

app.post('/api/users', (req, res) => {
    console.log(req.body); 

    const newUserName = req.body.nom;
    const newUserEmail = req.body.email;

    if (!newUserName || !newUserEmail) {
        return res.status(400).json({ error: "Les champs 'nom' et 'email' sont requis." });
    }

    lastId = listeUser[listeUser.length - 1].id;

    const newUser = {
        id: lastId + 1,
        nom: newUserName,
        email: newUserEmail
    };

    listeUser.push(newUser);

    res.json({ message: "Nouvel utilisateur ajouté", users: listeUser });
});

app.delete('/api/users/:id', (req, res) => {
    const userid = parseInt(req.params.id); // Convertir en nombre
    const indexUser = listeUser.findIndex(u => u.id === userid);

    if (indexUser !== -1) {
        listeUser.splice(indexUser, 1); // Utiliser splice pour supprimer l'élément
        res.json({ message: "Utilisateur supprimé", users: listeUser });
    } else {
        res.status(404).json({ error: "Utilisateur non trouvé" });
    }
});




app.put('/api/users/:id', (req, res) => {
    const userid = req.params.id;
    const index = listeUser.findIndex(u => u.id == userid);
    if (index > 0) {
        let isExist = listeUser.find(u => u.id == userid);
        if(isExist =! undefined) {
            listeUser[index].nom = req.body.nom;
            listeUser[index].email = req.body.email;
            res.json({message: "Utilisateur modifié :", users: listeUser});
        }else{
            res.status(404).end('Utilisateur non trouvé');
        }
    } else {
        res.status(404).end('Utilisateur non trouvé');
    }
});

const https = require('https');

app.get("/api/users/:id/details", async (req, res) => {
    const userId = req.params.id;

    try {
        const response = await axios.get(`https://jsonplaceholder.typicode.com/users/${userId}`, {
            httpsAgent: new https.Agent({ rejectUnauthorized: false })
        });

        res.json({ message: "Utilisateur trouvé", user: response.data });
    } catch (error) {
        console.error("Erreur Axios :", error.message);
        res.status(500).json({ error: "Erreur lors de la récupération des données externes" });
    }
});


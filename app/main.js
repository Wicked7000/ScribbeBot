const Discord = require('discord.js')
const MongoClient = require('mongodb').MongoClient
const client = new Discord.Client();

const connectionUrl = process.env.DB_URL
const databaseName = 'words'

const dbClient = new MongoClient(`mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@scribblecluster.sqash.mongodb.net/${databaseName}?retryWrites=true&w=majority`);

client.on('ready', () => {
    console.log(`Logged in as ${client.user.tag}`)
});

async function sendToDatabase(author, content, database_name, message){
    const dbConnection = await dbClient.connect();
    const wordsDatabase = dbConnection.db(databaseName)
    wordsDatabase.collection(database_name).insertOne({
        author,
        content,
    }, (error) => {
        if(error){
            message.reply('The message failed to add to the database please try again!');
        }else{
            message.reply('Message added!')
        }
    });
}

client.on('message', async (message) => {
    if (message.content === 'help'){
        const helpEmbed = new Discord.MessageEmbed()
            .setTitle('Help')
            .setAuthor('Help - Commands', '', 'https://discord.js.org')
            .addFields(
                { name: 'skribbl add [TEXT_HERE]', value: 'Adds to the database of skribbl words!' },
                { name: 'cah add [TEXT_HERE]', value: 'Adds to the database of cards against humanity words!' }
            )
        message.reply(helpEmbed)
    }else if (message.content.startsWith('skribbl add ')){
        sendToDatabase(message.author, message.content, 'skribbl')
    }else if (message.content.startsWith('cah add ')){
        sendToDatabase(message.author, message.content, 'cah')
    }else{
        message.reply('That is not a valid command! see help')
    }
});


client.login(process.env.BOT_TOKEN)


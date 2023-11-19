const { SlashCommandBuilder } = require('discord.js');
const axios = require('axios');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('dict')
        .setDescription('Search for a word in the dictionary')
        .addStringOption(option =>
            option.setName('word')
                .setDescription('word to look up')
                .setRequired(true)),
               
    async execute(interaction){
        const word = interaction.options.getString('word');
        
        try {
            // Make GET request to the API endpoint
            const response = await axios.get(`https://api.dictionaryapi.dev/api/v2/entries/en/${word}`);

            // Access the data from the response
            const apiResponse = response.data;

            // Construct the embed message
            const embed = {
                color: 0x0099ff,
                title: `Definition of ${word}`,
                fields: apiResponse[0].meanings.map(meaning => ({
                    name: `${meaning.partOfSpeech}`,
                    value: meaning.definitions.map(def => `- ${def.definition}`).join('\n'),
                })),
                footer: {
                    text: 'Dictionary',
                },
            };

            // Reply with the embed message
            await interaction.reply({ embeds: [embed] });
        } catch (error) {
            console.error('Error fetching data:', error);
            await interaction.reply('There was an error fetching the data.');
        }
    },
};
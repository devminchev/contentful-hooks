const updateWebhooksDict = [{
    shortName: 'game', 
    details: "update for gameV2 model"
}, 
{ 
    shortName: 'siteGame',
    details: 'update for siteGameV2 model'
},
{ 
    shortName: 'categories',
    details: 'update for categories|category models'
},
{ 
    shortName: 'sections',
    details: 'update for section|legendaryJackpotsSection|gamesFeatureSection models'
},
{ 
    shortName: 'ventures',
    details: 'update for ventures models'
},
{ 
    shortName: 'layouts',
    details: 'update for layout|miniGames models'
},
{ 
    shortName: 'footer',
    details: 'update for footer|footerIcon|footerLink|policy models'
}
];

const deleteWebhooksDict = [
    {
        shortName: 'game and siteGame',
        details: 'deletes both gameV2 and siteGameV2 models. Triggers ONLY on gameV2 model unpublish event.'
    },
    {
        shortName: 'general',
        details: 'deletes for unpublish events for the siteGameV2|section|legendaryJackpotsSection|gamesFeatureSection|layout|miniGames|categories|category|venture|localisation|footer|footerIcon|footerLink|policy models'
    }
]

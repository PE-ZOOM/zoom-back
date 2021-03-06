module.exports = {
    /*

        Fonction pour afficher un libellé en clair des filtres dans les exports excel
       

    */
   namefield: function (name){

    switch (name) {
    case "colonne40": return "Identifier ses caractéristiques personnelles : atouts et compétences, centres d'intérêt et aspirations personnels"
    case "colonne41": return "Identifier des contraintes éventuelles liées à sa situation personnelle"
    case "colonne42": return "Trouver des pistes de métier(s) diversifiées"
    case "colonne43": return "Confronter ses caractéristiques personnelles à celles du (des) métier(s) visé(s)"
    case "colonne44": return "Prioriser ses pistes de métier(s)"
    case "colonne45": return "Explorer la piste de la création / reprise d'entreprise"
    case "colonne46": return "Confronter ses pistes de métier(s) aux caractéristiques du marché du travail"
    case "colonne47": return "Identifier, dans son environnement, les soutiens à son projet"
    case "colonne48": return "Chercher de l'information sur le marché du travail et de la formation"
    case "colonne49": return "Identifier les compétences à acquérir pour réaliser son projet"
    case "colonne50": return "Identifier les moyens de se former et faire reconnaître ses compétences"
    case "colonne51": return "Construire son parcours de formation"
    case "colonne163": return "Explorer la piste d'un projet professionnel à l'étranger"
    case "colonne64" : return "Cibler et s'informer sur les entreprises à contacter"
    case "colonne65" : return "Organiser ses démarches de recherche d'emploi"
    case "colonne66" : return "Approfondir les modalités de mise en œuvre de son projet de création ou reprise d'entreprise"
    case "colonne80" : return "Connaître les acteurs de l'emploi et mobiliser leurs services"
    case "colonne82" : return "Valoriser ses compétences et ses atouts dans une candidature, CV et ou lettre de motivation"
    case "colonne83" : return "Valoriser ses compétences et ses atouts lors d'un entretien"
    case "colonne84" : return "Activer et élargir son réseau à des fins professionnelles"
    case "colonne85" : return "Identifier les démarches à mettre en œuvre pour créer son entreprise"
    case "colonne86" : return "Valoriser son projet d'entreprise"
    case "colonne95" : return "Candidater et adapter ses candidatures en fonction de l'emploi visé"
    case "colonne96" : return "Suivre et analyser le résultat de ses candidatures"
    case "colonne97" : return "Réussir son intégration en entreprise"
    case "colonne98" : return "Réaliser les démarches de mise en œuvre de son projet d'entreprise"
    case "colonne99" : return "Être accompagné(e) dans le développement de son activité"
    case "colonne143" : return "Utiliser un équipement informatique"
    case "colonne144" : return "Créer, mettre en forme et modifier un document informatique (CV, lettre de motivation)"
    case "colonne145" : return "Utiliser internet et ses services"
    case "colonne146" : return "Communiquer et échanger sur internet"
    case "colonne147" : return "Connaître les conditions d'utilisation d'internet"
    case "colonne160" : return "Approfondir les modalités de mise en œuvre de son projet de recherche d'emploi à l'étranger"
    case "colonne109" : return "Le demandeur d'emploi exprime un besoin d'appui pour faire face à des difficultés financières"
    case "colonne113" : return "Le demandeur d'emploi exprime un besoin d'appui pour faire face à des difficultés administratives ou juridiques"
    case "colonne117" : return "Le demandeur d'emploi exprime un besoin d'appui pour prendre en compte son état de santé"
    case "colonne122" : return "Le demandeur d'emploi exprime un besoin d'appui pour faire face à des difficultés de logement"
    case "colonne127" : return "Le demandeur d'emploi exprime un besoin d'appui pour accéder à un moyen de transport"
    case "colonne136" : return "Le demandeur d'emploi exprime un besoin d'appui pour développer ses capacités d'insertion et de communication"
    case "colonne140" : return "Le demandeur d'emploi exprime un besoin d'appui pour surmonter des contraintes familiales"
    case "dc_lblaxetravailprincipal" : return "Axe de travail principal"
    case "c_top_oreavalider_id" : return "ORE à contractualiser"
    case "dc_parcours" : return "Modalité d'accompagnement"
    case "tranche_age" : return "Tranche d'âge"
    case "libelle_ape" : return "APE du DE"
    case "cadre_rp" : return "Qualification Cadre ROME Principal"
    case "crea" : return "Projet Création Entreprise"
    case "dc_anc18mois" : return "Ancienneté d'inscription (18 mois)"
    case "nbfrein" : return "Nombre de freins périphériques à l'emploi"
    case "z1_diag" : return "Diag"
    case "z2_consent_visio" : return "Consentement visio"
    case "z3_trsansentretien" : return "Nombre de jours depuis le dernier entretien"
    case "z4_trsanscontactsortantteloumel" : return "Nombre de jours depuis le dernier contact sortant tel ou mail"
    case "z5_trsansformation" : return "Nombre de jours depuis la dernière formation"
    case "z6_trsanspresta" : return "Nombre de jours depuis la dernière prestation"
    case "z8_trdepuisdpae" : return "Nombre de jours depuis la dernière DPAE"
    case "z9_pic" : return "PIC"
    case "dc_dernieragentreferent" : return "Référent"
    case "dc_structureprincipalede" : return "Structure"
    case "dt" : return "DT"
    case "dc_structureprincipalesuivi" : return "Structure"
    case "dc_modalitesuiviaccomp_id" : return "MSA"
    case "annee" : return "Année"
    case "nom_complet" : return "Nom du référent affecté"
    case "dc_statutaction_id" : return "Statut de l'action"
    case "nom_ref" : return "Nom du référent"
    case "dc_agentreferent" : return "Référent affecté"
    case "libelle_ape" : return "Libellé APE"
    case "y1_carte_visite" : return "Carte de visite"
    case "y2_nb_besoin_num" : return "Nombre de besoins numériques"
    case "y3_trdepuismod" : return "Nombre de mois depuis dernière affectation MSA"
    default : console.log('missing') ;
     }
   }}
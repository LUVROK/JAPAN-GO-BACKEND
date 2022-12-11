import express from 'express';
import JishoAPI from 'unofficial-jisho-api';
import translate from "translate";
import TeachableMachine from '@sashido/teachablemachine-node'

const router = express.Router();

const model2 = new TeachableMachine({
    modelUrl: "https://teachablemachine.withgoogle.com/models/A3lE7nwKm/" // 21-41 + 16, без 32
});
const model3 = new TeachableMachine({
    modelUrl: "https://teachablemachine.withgoogle.com/models/WnnwLKl31/" // 41-60 + 32
});
const model4 = new TeachableMachine({
    modelUrl: "https://teachablemachine.withgoogle.com/models/IpfXV6bW2/" // 61-80
});
const model1 = new TeachableMachine({
    modelUrl: "https://teachablemachine.withgoogle.com/models/qYg8BSkmD/" //1-21, без 16
});

// modelUrl: "https://teachablemachine.withgoogle.com/models/-UPsQyZXd/" //80 символов

router.post('/alldata', async (req, res) => {
    try {
        const request = req.body.data;
        let resData = [];

        const jisho = new JishoAPI();
        let kunyomi = '', onyomi = '', resultUri = '', audio = '', typeAudio = '';
        let jlptLevel, newspaperFrequencyRank, onyomiExamples, kunyomiExamples, redical, meaningRadical, redicalForms = '', parts = '';
        await jisho.searchForKanji(`${request}`).then(result => {
            let i = 0;
            for (const element of result.kunyomi) {
                i++; kunyomi += element;
                i < result.kunyomi.length ? kunyomi += ', ' : null;
            }
            // console.log(kunyomi);
            i = 0;
            for (const element of result.onyomi) {
                i++; onyomi += element;
                i < result.onyomi.length ? onyomi += ', ' : null;
            }
            // console.log(onyomi);
            i = 0;
            for (const element of result.parts) {
                i++; parts += element;
                i < result.parts.length ? parts += ', ' : null;
            }
            // console.log(parts);
            i = 0;
            // console.log(result.radical.forms);
            if (result.radical.forms !== undefined) {
                for (const element of result.radical.forms) {
                    i++; redicalForms += element;
                    i < result.radical.forms.length ? redicalForms += ', ' : null;
                    // console.log(result.radical.forms.length)
                }
            }
            else {
                redicalForms = 'нету'
            }

            resultUri = result.uri;
            jlptLevel = result.jlptLevel;
            newspaperFrequencyRank = result.newspaperFrequencyRank;
            onyomiExamples = result.onyomiExamples;
            kunyomiExamples = result.kunyomiExamples;
            redical = result.radical.symbol;
            meaningRadical = result.radical.meaning;
            // parts = result.parts;
            // console.log(result)
        });

        resData.push({ kunyomi: kunyomi })
        resData.push({ onyomi: onyomi })
        resData.push({ resultUri: resultUri })
        resData.push({ jlptLevel: jlptLevel })
        resData.push({ newspaperFrequencyRank: newspaperFrequencyRank })
        resData.push({ onyomiExamples: onyomiExamples })
        resData.push({ kunyomiExamples: kunyomiExamples })
        resData.push({ redical: redical })

        translate.engine = "google";
        translate.key = process.env.GOOGLE_KEY;
        const text = await translate(meaningRadical, "ru");
        // console.log(text);

        resData.push({ meaningRadical: text })
        resData.push({ redicalForms: redicalForms })
        resData.push({ parts: parts })
        // console.log(kunyomiExamples)

        await jisho.scrapeForPhrase(`${request}`).then((data) => {
            // console.log('BOOM ' + JSON.stringify(data.audio[0]));
            data.audio[0] === undefined ? typeAudio = 'Roboto' : [typeAudio = 'Sound', audio = data.audio[0].uri];
            // console.log(data)
            resData.push({ typeAudio: typeAudio })
            resData.push({ audio: audio })
            resData.push({ otherForms: data.otherForms })
        });

        // console.log(resData)

        res.status(200).json({ resData })
    }
    catch (e) {
        console.log(e);
        res.status(400).json({ message: 'Провал' });
    }
});

router.post('/checkDrawBrain', async (req, res) => {
    try {
        const url = req.body.data.signature;
        const keyNeiro = req.body.data.keyNeiro;

        // console.log(keyNeiro)

        switch (keyNeiro) {
            case (1):
                checkDraw(model1);
                break;
            case (2):
                checkDraw(model2);
                break;
            case (3):
                checkDraw(model3);
                break;
            case (4):
                checkDraw(model4);
                break;
        }

        function checkDraw(model) {
            model.classify({
                imageUrl: `${url}`,
            }).then((predictions) => {
                // console.log(predictions);
                // console.log(`\n`);
                res.json(predictions);
            }).catch((e) => {
                console.error(e);
                res.status(500).send("Something went wrong!")
            });
        }

        // res.status(200).json({ message: "Успех" })
    }
    catch (e) {
        console.log(e);
        res.status(400).json({ message: 'Провал' });
    }
});

export default router;
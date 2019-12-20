const mailjet = require ('node-mailjet')
.connect(process.env.MJ_APIKEY_PUBLIC, process.env.MJ_APIKEY_PRIVATE)
const router = require('express').Router();

router.route('/:email/:name/').post((req, res) => {
  const email = req.params.email;
  const name = req.params.name;
  const request = mailjet
  .post("send", {'version': 'v3.1'})
  .request({
    "Messages":[
      {
        "From": {
          "Email": "support@begtool.se",
          "Name": "Begtools team"
        },
        "To": [
          {
            "Email": email,
            "Name": name
          }
        ],
        "Subject": "Din annons är nu upplagd på Begtool.se",
        "TextPart": "Tack för att du använda vår tjänst",
        "HTMLPart": "<h3>Här kan du se din annons: <a href='https://begtool.herokuapp.com/'>Annons</a>!</h3><br /> Här kan du ta bort din annons: <a href='https://begtool.herokuapp.com/'>Ta bort annons</a>!</h3><br /> Tack för att du använde vår tjänst!",
        "CustomID": "Begtool_mailservice"
      }
    ]
  })
  request
  .then(() => 
      console.log(res.json("Email sent to: " + email))
  )
  .catch((err) => {
      console.log(err.statusCode)
    })
});

module.exports = router;

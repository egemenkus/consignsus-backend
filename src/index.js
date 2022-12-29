require("dotenv").config()
const app = require("express")()
const helmet = require("helmet")
app.use(helmet())

const registerRoute = require("./routes/register")
app.use("/register", registerRoute)

const loginRoute = require("./routes/login")
app.use("/login", loginRoute)

const changePasswordRoute = require("./routes/changepassword")
app.use("/changePassword", changePasswordRoute)

const getDocumentRoute = require("./routes/getDocument")
app.use("/getDocument", getDocumentRoute)

const documentUploadRoute = require("./routes/documentUpload")
app.use("/documentUpload", documentUploadRoute)

const forgotPasswordRoute = require("./routes/forgotPassword")
app.use("/forgotPassword", forgotPasswordRoute)

const signDocumentRoute = require("./routes/signDocument")
app.use("/signDocument", signDocumentRoute)

const usersAllDocs = require("./routes/getUserAllDocuments")
app.use("/getAllDocs",usersAllDocs)

const userProfileInfo = require("./routes/getUserData")
app.use("/getProfile", userProfileInfo)


const port = process.argv[2] ||process.env.SERVER_PORT || 3000
app.listen(port, () => {
    console.log(`API listening on ${port}`)
})

const express = require('express')
const dotenv = require('dotenv');
const { application } = require('express');
dotenv.config();



/** connet app */
const port = process.env.PORT;
application.listen(`${port}`, () => {
    console.log(`Server running on port ${port}`)
});
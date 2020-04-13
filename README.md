# YorkU Course adder Bot
This allows you to keep sending add requests once every 3 hours REM for ONE course out a time, then sends you an email to confirm if it gets added.

### Getting started

```sh
$ git clone {THIS_REPO}
$ cd YorkU_REM_Bot
$ touch .env
$ npm install
```

Add the following to .env file. Syntax matters greately. Please follow accordinly

```
YORKU_PASSPORT_USERNAME=XXXXXX
YORKU_PASSPORT_PASSWORD=XXXXX
COURSE_CODE=XXXXXX
MY_EMAIL=xxxxxx@gmail.com
MY_EMAIL_PASS=xxxxx
SEND_TO_EMAIL=xxxxxx@gmail.com
```

That is it! 

now run
```
npm start
```
This will start the server. 

You can have it keep running! or you can deploy it anywhere like heroku

follow [this](https://devcenter.heroku.com/articles/deploying-nodejs) for more details

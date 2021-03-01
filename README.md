# node-url-masker

## To mask a URL
`curl -X GET http://localhost:8080/mask?url=<URL>`

#### Response
```
{"md5":"<MD5SUM>"}
```

## To get a URL
`curl -X GET http://localhost:8080/unmask?hash=<HASH>`

#### Reponse
```
{"url":"<URL>"}
```

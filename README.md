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

## Testing
`npm run test`

#### Output
```
the md5sum function
  ✓ should calculate md5sum

the cleanURL function
  ✓ should handle empty/null/undefined strings
  ✓ should trim whitespaces from strings
  ✓ should handle objects other than strings
```

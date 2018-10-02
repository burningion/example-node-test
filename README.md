# Example Node Test

A user reported that importing the `dd-trace` js broke his webserver. This is a partial reproduction of how it's happening.

```
DD_API_KEY=<REDACTED> docker-compose up
```

Should bring up the server. If you try hitting localhost:9001/hello, you'll see traces, but get nothing back from server. Comment out the tracer import, and you'll get a working server (livereload is enabled)

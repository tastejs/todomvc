// +build ignore

package main

import (
	"log"
	"net/http"
)

func main() {
	addr := "localhost:8000"
	log.Println("Serving on http://" + addr)
	log.Fatal(http.ListenAndServe(addr, http.FileServer(http.Dir("."))))
}

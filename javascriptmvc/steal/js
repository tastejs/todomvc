#!/bin/sh
# This script checks for arguments, if they don't exist it opens the Rhino dialog
# if arguments do exist, it loads the script in the first argument and passes the other arguments to the script
# ie: ./js steal/script/controller Todo

if [ $# -eq 0 ]
then
  java -cp steal/rhino/js.jar:funcunit/java/selenium-java-client-driver.jar org.mozilla.javascript.tools.shell.Main
  exit 127
fi
if [ $1 = "-selenium" ]
then
  java -jar funcunit/java/selenium-server.jar
  exit 127
fi
CP=funcunit/java/selenium-java-client-driver.jar:steal/rhino/js.jar
if [ $1 = "-mail" ]
then
	CP=steal/rhino/mail.jar:funcunit/java/selenium-java-client-driver.jar:steal/rhino/js.jar
	shift
fi

ERRORLEV=0
if [ $1 = "-e" ]
then
	ERRORLEV=1
	shift
fi

if [ $1 = "-h" -o $1 = "-?" -o $1 = "--help" ]
then
echo Load a command line Rhino JavaScript environment or run JavaScript script files in Rhino.
echo Available commands:
echo -e "./js\t\t\t\tOpens a command line JavaScript environment"
echo -e "./js -d\t\t\t\tOpens the Rhino debugger"
echo -e "./js [FILE]\t\t\tRuns FILE in the Rhino environment"
echo -e ""
echo  -e "JavaScriptMVC script usage:"
echo  -e "./js steal/generate/app [NAME]\t\tCreates a new JavaScriptMVC application"
echo  -e "./js steal/generate/page [APP] [PAGE]\tGenerates a page for the application"
echo  -e "./js steal/generate/controller [NAME]\tGenerates a Controller file"
echo  -e "./js steal/generate/model [TYPE] [NAME]\tGenerates a Model file"
echo  -e "./js apps/[NAME]/compress.js\t\tCompress your application and generate documentation"
  exit 127
fi

if [ $1 = "-d" ]
then
        java -classpath steal/rhino/js.jar:steal/rhino/selenium-java-client-driver.jar org.mozilla.javascript.tools.debugger.Main
        exit 127
fi

ARGS=[
for arg
do
  if [ $arg != $1 ]
  then
    ARGS=$ARGS"'$arg'",
  fi
done
ARGS=$ARGS]
java -Xss1024k -cp $CP org.mozilla.javascript.tools.shell.Main -e _args=$ARGS -opt -1 -e 'load('"'"$1"'"')'

if [ $ERRORLEV = "1" -a $? = "1" ]
then
	exit $?
fi

:: This script checks for arguments, if they don't exist it opens the Rhino dialog
:: if arguments do exist, it loads the script in the first argument and passes the other arguments to the script
:: ie: js jmvc\script\controller Todo
@echo off
SETLOCAL ENABLEDELAYEDEXPANSION
if "%1"=="" (
	java -cp steal\rhino\js.jar org.mozilla.javascript.tools.shell.Main
	GOTO END
)
if "%1"=="-h" GOTO PRINT_HELP
if "%1"=="-?" GOTO PRINT_HELP
if "%1"=="--help" GOTO PRINT_HELP

if "%1"=="-d" (
	java -classpath funcunit/java/selenium-java-client-driver.jar;steal/rhino/js.jar org.mozilla.javascript.tools.debugger.Main
	GOTO END
)
SET CP=funcunit/java/selenium-java-client-driver.jar;steal\rhino\js.jar
SET ERRORLEV=0
if "%1"=="-e" (
	SET ERRORLEV=1
	SHIFT /1
)
SET ARGS=[
SET FILENAME=%1
SET FILENAME=%FILENAME:\=/%
::haven't seen any way to loop through all args yet, so for now this goes through arg 2-7
::dos sucks and for some reason this structure doesn't respect the shift, so we branch
if "%ERRORLEV%"=="1" (
	for /f "tokens=3,4,5,6,7,8 delims= " %%a in ("%*") do SET ARGS=!ARGS!'%%a','%%b','%%c','%%d','%%e','%%f'
) ELSE (
	for /f "tokens=2,3,4,5,6,7 delims= " %%a in ("%*") do SET ARGS=!ARGS!'%%a','%%b','%%c','%%d','%%e','%%f'
)
::remove the empty args
:: for %%a in (",''=") do ( call set ARGS=%%ARGS:%%~a%% )
SET ARGS=%ARGS:,''=%
::remove the spaces
:: for /f "tokens=1*" %%A in ("%ARGS%") do SET ARGS=%%A
SET ARGS=%ARGS: =%
SET ARGS=%ARGS%]
set ARGS=%ARGS:\=/%
java -Xmx512m -Xss1024k -cp %CP% org.mozilla.javascript.tools.shell.Main -opt -1 -e _args=%ARGS% -e load('%FILENAME%')

if "%ERRORLEV%"=="1" (
	if errorlevel 1 exit 1
)

GOTO END

:PRINT_HELP
echo Load a command line Rhino JavaScript environment or run JavaScript script files in Rhino.
echo Available commands:
echo js				Opens a command line JavaScript environment
echo js	-d			Opens the Rhino debugger
echo js -selenium   Starts selenium server
echo js [FILE]			Runs FILE in the Rhino environment

echo JavaScriptMVC script usage:
echo js steal/generate/app [NAME]	Creates a new JavaScriptMVC application
echo js steal/generate/page [APP] [PAGE]	Generates a page for the application
echo js steal/generate/controller [NAME]	Generates a Controller file
echo js steal/generate/model [TYPE] [NAME]	Generates a Model file
echo js apps/[NAME]/compress.js	Compress your application and generate documentation

:END

@echo off
@REM Get the folder path of the bat file
set folder=%~dp0

@REM Extract just the folder name (without trailing backslash)
for %%i in ("%folder:~0,-1%") do set foldername=%%~nxi

@REM Ask the user for the symbolic link name, using the folder name as default
set /p linkname="Enter the name for the symbolic link (default: %foldername%): "

@REM If no input is provided, use the folder name
if "%linkname%"=="" set linkname=%foldername%

@mklink /D "%folder%%linkname%" "%folder%"

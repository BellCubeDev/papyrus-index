#!/bin/bash
set -e

#
# Credits for this script:
# Base script: https://github.com/JosephM101/Wine-Install-Scripts/blob/main/install-wine.sh
# Modified logic: https://github.com/actions/runner-images/issues/743#issuecomment-624592523
#
# This script has been modified slightly to work better with GitHub Actions.
# The core logic remains the same and all credit goes to the respective authors.
#

RED='\033[0;31m'
GREEN='\033[0;32m'
CYAN='\033[0;36m'
NC='\033[0m' # No Color

ALREADYINSTALLED='winehq-stable is already the newest version'

if [[ $EUID -ne 0 ]]; then
    printf "${RED}This script must be run as root. Try using sudo. \r\nExiting...\r\n${NC}"
    exit 1
fi

terminate () {
    printf "${RED}Terminating..."
    carriage_return
    exit 1
}

carriage_return () {
    printf "\r\n"
}

print_done () {
    printf "${GREEN} done.\r\n"
}

install_wine () {


    sudo dpkg --add-architecture i386

    printf "${NC}Getting repo key from WineHQ..."
    if ! wget -nc https://dl.winehq.org/wine-builds/winehq.key; then
        printf "${RED}Failed to download WineHQ key\n"
        terminate
    fi
    print_done

    printf "${NC}Adding keys..."
    if ! sudo apt-key add winehq.key; then
        printf "${RED}Failed to add WineHQ key\n"
        terminate
    fi
    print_done

    printf "${NC}Adding WineHQ repository to APT (bionic main)..."
    sudo apt-add-repository 'deb https://dl.winehq.org/wine-builds/ubuntu bionic main'
    print_done

    printf "${NC}Installing software-properties-common..."
    sudo apt install software-properties-common
    print_done

    printf "${NC}Updating APT cache..."
    sudo apt update
    print_done

    printf "${NC}Installing WineHQ Stable package..."
    sudo apt-get install --install-recommends winehq-stable -y
    print_done

    printf "${NC}Install completed. Getting Wine version...${NC}"
    carriage_return
    WOUT=`wine --version`
    printf "${NC}Command ${GREEN}wine --version ${NC}returned ${RED}${WOUT}"
    carriage_return
    printf "${GREEN}Looks like everything's working."
    carriage_return
    printf "${NC}Cleaning up..."
    sudo apt autoremove
    rm winehq.key
    printf "${NC}Done installing Wine."
    carriage_return
}

install_wine

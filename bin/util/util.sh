#!/usr/bin/env bash

# CONSTANTS:
readonly UTIL_BOLD=$(tput bold)
readonly UTIL_UNDERLINE=$(tput sgr 0 1)
readonly UTIL_RESET=$(tput sgr0)

readonly UTIL_PURPLE=$(tput setaf 171)
readonly UTIL_RED=$(tput setaf 1)
readonly UTIL_GREEN=$(tput setaf 76)
readonly UTIL_TAN=$(tput setaf 3)
readonly UTIL_BLUE=$(tput setaf 38)

# LOGGING:
function utils::print_header() {
    printf "\n${UTIL_BOLD}${UTIL_PURPLE}==========  %s  ==========${UTIL_RESET}\n" "$@" 1>&2
}

function utils::print_arrow() {
    printf "➜ $@\n" 1>&2
}

function utils::print_success() {
    printf "${UTIL_GREEN}✔ %s${UTIL_RESET}\n" "$@" 1>&2
}

function util::print_error() {
    printf "${UTIL_RED}✖ %s${UTIL_RESET}\n" "$@" 1>&2
}

function util::print_warning() {
    printf "${UTIL_TAN}➜ %s${UTIL_RESET}\n" "$@" 1>&2
}

function util::print_underline() {
    printf "${UTIL_UNDERLINE}${UTIL_BOLD}%s${UTIL_RESET}\n" "$@" 1>&2
}
function util::print_bold() {
    printf "${UTIL_BOLD}%s${UTIL_RESET}\n" "$@"
}

function util::print_note() {
    printf "${UTIL_UNDERLINE}${UTIL_BOLD}${UTIL_BLUE}Note:${UTIL_RESET}  ${UTIL_BLUE}%s${UTIL_RESET}\n" "$@" 1>&2
}

function util::is_cygwin_env() {
    [[ $(uname -s) == 'CYGWIN'* ]]
}

source "${UTIL_ROOT_PATH}/dockerutil.sh"

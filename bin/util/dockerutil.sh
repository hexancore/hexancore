#!/usr/bin/env bash
# Contains some useful functions for docker

function dockerutil::get_docker_shared_project_dir() {
    local ret=$PWD

    # check for cygwin users(on windows)
    if $(utils::is_cygwin_env); then
        # for windows users you must sets shared folder on projects
        # help: https://gist.github.com/matthiasg/76dd03926d095db08745
        local shared_dir=${DOCKER_SHARED_PROJECT_DIR:-'//home/docker/projects'}
        # replaced projects root dir with shared dir
        ret="${shared_dir}/$(basename $PWD)"
    fi

    echo $ret
}

function dockerutil::pwd() {
    local ret=$PWD

    # check for cygwin users(on windows)
    if $(utils::is_cygwin_env); then
       ret=$(cygpath -w "$PWD")
    fi

    echo $ret
}

#######################################
# Returns true when service with given name exists
# Globals:
#   None
# Arguments:
#   service_name
# Returns:
#   not empty when exists
#######################################
function dockerutil::service_exists {
    local exists=$(docker service ls -q -f "name=${1}")
    [ ! -z "$exists" ]
}

#######################################
# Removes docker entities with selected type and label
# Globals:
#   None
# Arguments:
#  type - entity type: service, secret, volume, network, config
#  label - entity label
# Returns:
#   None
#######################################
function dockerutil::remove_entities_with_label {
    local type=$1
    local label=$2
    local sleep_time=${3:-2}
    local entities=$(docker $type ls -qf "label=$label")
    if [ -n "$entities" ]; then
        docker "$type" ls -qf "label=$label" | xargs -I{} docker $type rm "{}"
        sleep $sleep_time
    fi
}

#######################################
# Removes all docker entities with selected label
# Globals:
#   None
# Arguments:
#  label - entity label
#  [sleep_time] - how long sleep after remove all entities of one type(some entities need some time to remove)
# Returns:
#   None
#######################################
function dockerutil::clean_all_with_label() {
    local label=$1
    local sleep_time=${2:-2}
    utils::print_header "Removing entities with label: $label"
    for type in 'service' 'secret' 'volume' 'network' 'config'
    do
        utils::print_arrow "removing ${type}s"
        set +e
        tries=0
        until [ $tries -ge 5 ]
        do
            tries=$[$tries+1]
            dockerutil::remove_entities_with_label "$type" "$label" $sleep_time && break

        done
        set -e
    done

}

#######################################
# Returns true when network with given name exists
# Globals:
#   None
# Arguments:
#   service_name
# Returns:
#   bool
#######################################
function dockerutil::network_exists {
    local exists=$(docker network ls -q -f "name=${1}\$")
    [ ! -z "$exists" ]
}

function dockerutil::secret_exists {
    local exists=$(docker secret ls -q -f "name=${1}")
    [ "$exists" != '' ]
}

function dockerutil::create_secret_if_not_exists {
    local name=$1
    local value=$2

    if ! $(dockerutil::secret_exists $name); then
        echo $value | docker secret create $name -
        utils::print_success "secret $name created"
    else
        utils::print_warning "secret $name exists"
    fi
}

function dockerutil::exec_command_in_container {
    local container=$1
    local command=$2

    echo $(docker exec $container /bin/sh -c "$command")
}

function dockerutil::get_container_file_contents {
    local container=$1
    local filename=$2

    if [ ! $(dockerutil::exec_command_in_container $container "[ -f $filename ] && echo "1" || echo ''") ]; then
        utils::print_error "file: $filename in container not exists"
        return 1
    fi

    echo $(dockerutil::exec_command_in_container $container "cat $filename")
}

function dockerutil::get_service_container {
    local service_name=$1

    local service_filter="label=com.docker.swarm.service.name=$service_name"
    while [ ! "$(docker ps -f "$service_filter" -f "status=running" -q)" ];
    do
        utils::print_note "waiting for container of $service_name service"
        sleep 2
    done
    echo $(docker ps -f "$service_filter" -q)
}
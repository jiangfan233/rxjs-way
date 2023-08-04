### Play gitlab with podman

<b>If you are in China, make sure you have a stable and 'magic' network.</b>

- 0、Prepare

```bash
mkdir -p ~/gitlab/config

mkdir -p ~/gitlab/data

mkdir -p ~/gitlab/log

# I suggest to append this line to the end of the ~/.bashrc file
export GITLAB_HOME=~/gitlab

```

- 1、First, pull the gitlab image. [how to install ?](https://podman.io/docs/installation)

```bash
# this image is about 3G, it's gonna take a while.
podman pull docker.io/gitlab
``` 

- 2、Copy files of the container.(<b>Do not modify permissions!</b>)

```bash
podman run —name gitlab -d gitlab

# configs and ssh_keys
podman cp gitlab:/etc/gitlab ~/gitlab/config

# data
podman cp gitlab:/var/opt/gitlab ~/gitlab/data

# logs
podman cp gitlab:/var/log/gitlab ~/gitlab/log
```

3、Run the container.

create a bash file:

```bash
nano ~/gitlab/gitlab-run.sh
```

and then paste this command to the file

```bash
podman run --name "gitlab"               \
    --hostname "saas.git.com"                  \
    -p 80:80 -p 4430:443 -p 8082:8080 -p 2222:2222  \
    -v ${GITLAB_HOME}/config:/etc/gitlab    \
    -v ${GITLAB_HOME}/data:/var/opt/gitlab  \
    -v ${GITLAB_HOME}/log:/var/log/gitlab   \
    --restart unless-stopped                \
    -d gitlab_image_id
```

<b>There are a lot of services in gitlab, make sure you have enough ports.</b>

4、Synchronize time.

Ensure that the host time, container time, and container internal software time are the same.

```bash
# check time
date

# check container internal software time
cat ~/gitlab/data/gitlab.rb | grep gitlab_rails['time_zone']
```

5、Check the running status of gitlab.

```bash
# make sure all services are running except the services you stopped.
podman exec -it gitlab gitlab-ctl status
```

6、Add a service daemon to the container(systemd)

```bash
mkdir -p ~/.config/systemd/user
cd ~/.config/systemd/user

# -f, --files   Generate .service files instead of printing to stdout 
# -n, --name    Use container/pod names instead of IDs
podman generate systemd -f -n gitlab

# there should be a file called "container.gitlab.service"
ls -al | gitlab 

# make sure this service would start automatically after reboot.
systemctl --user enable container-essearch-ui.service --now

# make sure this service would not stop after the current user log out.
loginctl enable-linger
```


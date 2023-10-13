
/data/config/auto/startup.sh
```angular2html

# install all packages for the extensions
shopt -s nullglob
list=(./extensions/*/requirements.txt)
for req in "${list[@]}"; do
  pip install -q -r "$req"
done
list_of_install_scripts=(./extensions/*/install.py)
for install_script in "${list_of_install_scripts[@]}"; do
  export PYTHONPATH="/stable-diffusion-webui"
  python "$install_script"
done
#opencv-python-headless to not rely on opengl and drivers.
pip install -q --force-reinstall opencv-python-headless

```

Build SnapShot
```angular2html
./run.sh
```
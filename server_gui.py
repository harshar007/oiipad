import os
import sys

if __name__ == '__main__':
    gui_path = os.path.join(os.path.dirname(__file__), 'apps', 'pc-server', 'gui.py')
    os.system(f'{sys.executable} "{gui_path}"')

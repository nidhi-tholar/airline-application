# Requirements: <br/>
Python <br/>
MongoDB

# Project Setup:
1. Create virtual environment for the project 
2. Activate the venv (source venv_airline_server/bin/activate )
3. Run: pip install -r requirements.txt

# Running server on Terminal:
Route to the path where airline server directory is located, with activated virtual environment: <br/>
export FLASK_APP=__init__ <br/>
export FLASK_ENV=development <br/>
python -m flask run <br/>

# Running server on PyCharm:
1. Open run > Edit Configuration
2. Click +, name the configuration (Ex: airline)
3. In script give the absolute path of flask.exe <br/>
   (Ex: Script path: /Users/nidhitholar/projects/airline_project/venv_airline_server/bin/flask)
4. In Parameters, enter/type "run"
5. Environment variables, add FLASK_APP=__init__.py, FLASK_ENV=development
6. working directory:  /Users/nidhitholar/projects/airline_project/airline-server

Requirements:
Python
MongoDB
___________________________________________________________
Project Setup:
Create virtual environment for the project (I named it venv_202_team)
Activate it ( source venv_202_team/bin/activate )
run: pip install -r requirements.txt

Running server on Terminal:
1. route to the path where airline server directory is
(in airline-server directory, activated virtual environment):
export FLASK_APP=__init__
export FLASK_ENV=development
python -m flask run
___________________________________________________________
Running server on PyCharm:
1. Open run > Edit Configuration
2. Click +, name the configuration (Ex: airline)
3. In script give the absolute path of flask.exe <br/>
   My path for reference: Script path: /Users/nidhitholar/cmpe202/team_project/venv_202_team/bin/flask 
4. In Parameters, enter/type "run"
5. Environment variables, add FLASK_APP=__init__.py, FLASK_ENV=development
6. working directory
    /Users/nidhitholar/cmpe202/team_project/team-project-team_techies/airline-server

___________________________________________________________
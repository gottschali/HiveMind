import nox


nox.options.sessions = "lint", "tests"
locations = "src", "tests", "noxfile.py"


@nox.session
def tests(session):
    args = session.posargs or ["--cov"]
    session.run("poetry", "install", external=True)
    session.run("pytest", *args)

@nox.session
def black(session):
    args = session.posargs or locations
    session.install("black")
    session.run("black", *args)

@nox.session
def lint(session):
    args = session.posargs or locations
    session.install("flake8", "flake8-black", "flake8-import-order")
    session.run("flake8", *args)


import nox

nox.options.sessions = "isort", "black", "lint", "mypy", "tests"
locations = "hivemind", "tests"

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
def isort(session):
    args = session.posargs or locations
    session.install("isort")
    session.run("isort", *args)

@nox.session
def lint(session):
    args = session.posargs or locations
    session.install("flake8",
                    "flake8-annotations",
                    "flake8-black",
                    "flake8-import-order")
    session.run("flake8", *args)

@nox.session
def mypy(session):
    args = session.posargs or locations
    session.install("mypy")
    session.run("mypy", *args)

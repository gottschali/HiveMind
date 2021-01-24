import nox

nox.options.sessions = "format", "lint", "mypy", "tests"
locations = ("hivemind",)
more_locations = ("hivemind", "tests", "mcts", "brain", ".")


@nox.session
def tests(session):
    args = session.posargs or ["--cov"]
    session.run("poetry", "install", external=True)
    session.run("pytest", *args)


@nox.session
def format(session):
    args = session.posargs or more_locations
    session.install("black")
    session.install("isort")
    session.run("isort", *args)
    session.run("black", *args)


@nox.session
def lint(session):
    args = session.posargs or locations
    session.install(
        "flake8", "flake8-annotations", "flake8-black", "flake8-import-order"
    )
    session.run("flake8", *args)


@nox.session
def mypy(session):
    args = session.posargs or locations
    session.install("mypy")
    session.run("mypy", *args)

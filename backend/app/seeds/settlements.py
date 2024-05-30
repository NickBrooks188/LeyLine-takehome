from app.models import db, Settlement, environment, SCHEMA
from sqlalchemy.sql import text

settlements = [

]

def seed_servers():
    """
    Func that creates and adds server seed data to the database
    """

    [db.session.add(settlement) for settlement in settlements]
    db.session.commit()

def undo_servers():
    """
    func that unseeds the data for Servers
    """

    if environment == 'production':
        db.session.execute(f"TRUNCATE table {SCHEMA}.servers RESTART IDENTITY CASCADE")

    else:
        db.session.execute(text("DELETE FROM servers"))

    db.session.commit()

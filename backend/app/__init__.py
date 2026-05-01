# from flask import Flask
# from app.config import Config
# from app.extensions import cors, migrate, db, jwt
# from api.routes import register_blueprints
#
# def create_app():
#     app = Flask(__name__)
#     app.config.from_object(Config)
#
#     cors.init_app(
#         app,
#         origins=["http://localhost:5173", "http://localhost:3000"],
#         supports_credentials=False
#     )
#
#     db.init_app(app)
#     migrate.init_app(app, db)
#     jwt.init_app(app)
#
#     register_blueprints(app)
#
#     @app.get("/health")
#     def health():
#         return {"status": "ok"}, 200
#
#     return app

from flask import Flask
from app.config import Config
from app.extensions import cors, migrate, db, jwt, ma

def create_app():
    app = Flask(__name__)
    app.config.from_object(Config)

    cors.init_app(app, origins=["http://localhost:5173", "http://localhost:3000"], supports_credentials=False)

    db.init_app(app)
    migrate.init_app(app, db)
    jwt.init_app(app)
    ma.init_app(app)

    with app.app_context():
        from api.entity.user import User
        from api.entity.city import City  # noqa
        from api.entity.region import Region  # noqa
        from api.entity.crop import Crop  # noqa
        from api.entity.observation import Observation  # noqa
        from api.entity.prediction import Prediction  # noqa

        db.create_all()


    from api.routes import register_blueprints
    register_blueprints(app)

    @app.get("/health")
    def health():
        return {"status": "ok"}, 200

    return app
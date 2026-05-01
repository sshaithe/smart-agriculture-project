def register_blueprints(app):
    from api.routes.auth_routes import auth_bp
    from api.routes.city_routes import blueprint as city_bp
    from api.routes.region_routes import blueprint as region_bp
    from api.routes.crop_routes import blueprint as crop_bp
    from api.routes.observation_routes import blueprint as observation_bp
    from api.routes.prediction_routes import blueprint as prediction_bp

    app.register_blueprint(auth_bp, url_prefix="/api")
    app.register_blueprint(city_bp, url_prefix="/api")
    app.register_blueprint(region_bp, url_prefix="/api")
    app.register_blueprint(crop_bp, url_prefix="/api")
    app.register_blueprint(observation_bp, url_prefix="/api")
    app.register_blueprint(prediction_bp, url_prefix="/api")


    # başka blueprintlerin varsa buraya ekle:
    # from app.routes.user_routes import blueprint as user_blueprint
    # app.register_blueprint(user_blueprint, url_prefix="/api")
class DevelopmentConfig:
    DEBUG = True
    LOGGING_LEVEL = 'DEBUG'
    HTTP_PORT = 50006
    
class ProductionConfig:
    DEBUG = False
    LOGGING_LEVEL = 'ERROR'
    HTTP_PORT = 50006


config_by_name = {
    'development': DevelopmentConfig,
    'production': ProductionConfig
}

def get_config_by_name(config_name):
    return config_by_name.get(config_name, DevelopmentConfig)
## consts
from config.constants import SONYCCONSTS

## third-party
import numpy as np

## native
import pickle
import glob
import os

class ModelPersistor:

    @staticmethod
    def save_model( prototypeName: str, model ):

        filepath = f"{SONYCCONSTS['PROTOTYPES']['MODELS']}{prototypeName}.pkl"
        with open(filepath, 'wb') as file:
            pickle.dump(model, file)

    @staticmethod
    def load_model( prototypeName: str ):

        # model = pickle.loads(s)
        filepath = f"{SONYCCONSTS['PROTOTYPES']['MODELS']}{prototypeName}.pkl"
        model = pickle.load(open(filepath, 'rb'))
        return model

    @staticmethod
    def save_representatives( prototypeName: str, listOfEmbeddings ):

        filepath = f"{SONYCCONSTS['PROTOTYPES']['REPRESENTATIVES']}/{prototypeName}"
        if( not os.path.isdir(filepath) ):
            os.mkdir( filepath )

        for clusterIndex, embedding in enumerate(listOfEmbeddings):
            
            representativePath = f"{filepath}/{clusterIndex}"
            np.save( representativePath, embedding )

    @staticmethod
    def load_representatives( prototypeName: str ):

        filepath = f"{SONYCCONSTS['PROTOTYPES']['REPRESENTATIVES']}/{prototypeName}"
        files = glob.glob( f"{filepath}/*" )

        representatives = {}
        for index, file in enumerate(files):
            currentEmbedding = np.load( file )
            representatives[index] = currentEmbedding

        return representatives

    @staticmethod
    def get_available_models():

        modelsfolder = f"{SONYCCONSTS['PROTOTYPES']['MODELS']}*"
        models = glob.glob(modelsfolder)
        models = list(map( lambda modelpath: os.path.basename(modelpath).split('.')[0], models ))
        return models


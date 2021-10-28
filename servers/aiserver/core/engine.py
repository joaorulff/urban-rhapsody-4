from spatial.spatialmanager import SpatialManager
from prototype.prototypemanager import PrototypeManager
from serialization.projectionencoder import ProjectionEncoder
from projector.projector import Projector
import json
from datasource.datasource import Datasource

class Engine:

    def __init__(self):

        self.prototypeManager = PrototypeManager()
        self.spatialManager = SpatialManager()
        pass

    ################## ANN ##################
    
    def get_nearest_neighbors( self, uids, k=50, embeddingModel: str = 'openl3' ):

        embeddings = Datasource.get_embeddings( uids=uids, embeddingModel=embeddingModel )
        
        for uid in embeddings:
            embeddings[uid] = self.spatialManager.get_nearest_neighbors( featureVector=embeddings[uid].tolist(), k=k )

        return json.dumps( embeddings )

    def get_prototype_nearest_neighbors( self, prototypeName: str, querySize: int, modelConfidence: float, embeddingModel: str = 'openl3' ):

        embeddings = self.prototypeManager.get_prototype_representatives( prototypeName=prototypeName )
        
        for clusterIndex in embeddings:

            ## getting nearest neighbors for current representative
            embeddings[clusterIndex] = self.spatialManager.get_nearest_neighbors( featureVector=embeddings[clusterIndex].tolist(), k=querySize )

        return json.dumps( embeddings )
    
    ################## PROJECTIONS ##################

    def project_points(self, projectionType, embeddingModel, uids, params={} ):
        
        embeddingList = Datasource.get_embeddings( uids=uids, embeddingModel=embeddingModel )
        embeddings = list( map(lambda uid: embeddingList[uid], embeddingList ))

        x, y = Projector.project_points( embeddings, projectionType, params )

        for index, frameuid in enumerate(embeddingList):
            embeddingList[frameuid] = { 'x': f'{x[index].item():.3f}' , 'y': f'{y[index].item():.3f}' }

        return json.dumps( embeddingList, cls=ProjectionEncoder )


    # ################## CLASSIFICATION ##################

    # def get_frame_classification( self, dataset, uids ):

    #     ## parsing predictions
    #     classificationList = Datasource.get_frame_classification( dataset, uids )

    #     ## returning
    #     return json.dumps( classificationList )


    ################## PROTOTYPES ##################

    '''
        prototypeName: str, 
        labels: list[str]
    '''
    def set_prototype( self, prototypeName, labels ):

        self.prototypeManager.set_prototype( prototypeName, labels )
        return json.dumps({'response': 'success'})

    def get_available_prototypes( self ):
        
        prototypes = self.prototypeManager.get_available_prototypes()
        return json.dumps({'prototypes': prototypes }) 

    def apply_prototype( self, prototypeName, uids ):

        ## getting correspondent embeddings
        embeddingList = Datasource.get_embeddings( uids=uids, embeddingModel='openl3' )

        ## calculating log-likelihood for each frame
        likelihoods = self.prototypeManager.calculate_prototype( prototypeName, embeddingList )
        return json.dumps({ 'likelihood': likelihoods })
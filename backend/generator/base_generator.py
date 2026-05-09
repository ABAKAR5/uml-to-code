from abc import ABC, abstractmethod

class BaseGenerator(ABC):
    def __init__(self, classes):
        self.classes = classes

    @abstractmethod
    def generate(self):
        pass

    @abstractmethod
    def generate_class(self, cls):
        pass
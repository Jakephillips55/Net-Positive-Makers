from django.db import models
import json
from datetime import datetime
import numpy as np
import pickle
import csv
from pathlib import Path
import cv2

class SimpleBot(models.Model):
    @classmethod
    def simple_bot(request, court):


      if int(court["bally"]) <= int(court["paddley"]):
        return True
      else:
        return False

    @classmethod
    def simple_bot_ws(request, bally, paddley, reward):
      if int(bally) <= int(paddley):
        print(True)
        return True
      else:
        print(False)
        return False

class AndrejBot(models.Model):
    prev_x = None # used in computing the difference frame
    model = pickle.load(open('pong/save.p', 'rb'))
    count = 0

    def __init__(self):
      self.prev_x = None
      self.model = pickle.load(open('pong/save.p', 'rb'))
      self.count = 0

    @classmethod
    def andrej_bot(self, pixels):
      D = 80 * 80
      # preprocess the observation, set input to network to be difference image
      cur_x = AndrejBot.prepro(pixels)
    
      x = cur_x - self.prev_x if self.prev_x is not None else np.zeros(D)
      self.prev_x = cur_x

      # forward the policy network and sample an action from the returned probability
      aprob, h = AndrejBot.policy_forward(x)
      print(aprob)
      move_up = True if 0.5 < aprob else False #take the action most likely to yield the best result
      return move_up

    @classmethod
    def sigmoid(request, x): 
      return 1.0 / (1.0 + np.exp(-x)) # sigmoid "squashing" function to interval [0,1]
      
    @classmethod
    def prepro(self, I):
      """ prepro 210x160x3 uint8 frame into 6400 (80x80) 1D float vector """
      image_array = np.asarray(I)
      a = image_array.reshape(320, 320, 3).astype('float32')
      a = cv2.cvtColor(cv2.resize(a,(80,80)), cv2.COLOR_BGR2GRAY)
     
      cv2.imwrite('color_img.jpg', a)
      # print(frame[0][frame != 0])
      print("this is the frame size", a.size)
      ret, a = cv2.threshold(a, 127, 255, cv2.THRESH_BINARY) # et is useless
      a[a == 255] = 1
      I = a.ravel()
      print(len(I))

      # if self.count == 20 :
      #   with open('final_file.csv', mode='w') as final_file: #store the pixels
      #         final_writer = csv.writer(final_file, delimiter=',', quotechar='"', quoting=csv.QUOTE_MINIMAL)
      #         final_writer.writerow(I)

      self.count += 1
      return I

    @classmethod
    def policy_forward(self, x):
      h = np.dot(self.model['W1'], x)
      h[h<0] = 0 # ReLU nonlinearity
      logp = np.dot(self.model['W2'], h)
      p = AndrejBot.sigmoid(logp)
      return p, h # return probability of taking action 2, and hidden state

  class AndrejBotTraining(models.Model):

  # hyperparameters
    H = 200 # number of hidden layer neurons
    batch_size = 10 # every how many episodes to do a param update?
    learning_rate = 1e-4
    gamma = 0.99 # discount factor for reward
    decay_rate = 0.99 # decay factor for RMSProp leaky sum of grad^2
    prev_x = None # used in computing the difference frame
    model = {}
    count = 0
    xs = []
    hs = []
    dlogps = []
    drs = []
    episode_number = 0
    reward_sum = 0
    my_file = Path("./training_data/episode_file.csv")
    

    def __init__(self):
      self.H = 200
      self.batch_size = 10 # every how many episodes to do a param update?
      self.learning_rate = 1e-4
      self.gamma = 0.99 # discount factor for reward
      self.decay_rate = 0.99
      self.prev_x = None
      self.count = 0
      self.xs = []
      self.hs = []
      self.dlogps = []
      self.drs = []
      self.reward = 0
      self.episode_number = 0
      self.my_file = Path("./training_data/episode_file.csv")
      self.resume = True if my_file.is_file() else False
      self.benchmark = False
      self.D = 80 * 80
      self.start_model = {}
        if self.benchmark:
          np.random.seed(0) ; self.start_model['W1'] = np.random.randn(self.H,self.D) / np.sqrt(self.D) # "Xavier" initialization
          np.random.seed(0) ; self.start_model['W2'] = np.random.randn(self.H) / np.sqrt(self.H)
        else:
          model['W1'] = np.random.randn(H,D) / np.sqrt(D) # "Xavier" initialization
          model['W2'] = np.random.randn(H) / np.sqrt(H)
      self.model = pickle.load(open('training_data/our_game_andrej.p', 'rb')) if self.resume == True else self.start_model
      
    @classmethod
    def andrej_training(self, pixels):

      if self.resume:
        print('Resuming run')
      else:
        print('First run')
        
      grad_buffer = { k : np.zeros_like(v) for k,v in model.items() } # update buffers that add up gradients over a batch
      #updated .iteritems to .items
      rmsprop_cache = { k : np.zeros_like(v) for k,v in model.items() } # rmsprop memory
      #updated .iteritems to .items
      running_reward = None
      cumulative_batch_rewards = 0

      if resume:
        data = import_csv('./training_data/episode_file.csv')
        episode_number = int(data[0])
      
      
      if self.count > 0:
        self.reward_sum += reward
        self.drs.append(reward) # record reward (has to be done after we call step() to get reward for previous action)

      # while True:
      if done: # an episode finished
        episode_number += 1
        # stack together all inputs, hidden states, action gradients, and rewards for this episode
        epx = np.vstack(self.xs)
        eph = np.vstack(self.hs)
        epdlogp = np.vstack(self.dlogps)
        epr = np.vstack(self.drs)
        self.xs,self.hs,self.dlogps,self.drs = [],[],[],[] # reset array memory

        # compute the discounted reward backwards through time
        discounted_epr = discount_rewards(epr)
        # standardize the rewards to be unit normal (helps control the gradient estimator variance)
        discounted_epr -= np.mean(discounted_epr)
        discounted_epr /= np.std(discounted_epr)

        epdlogp *= discounted_epr # modulate the gradient with advantage (PG magic happens right here.)
        grad = policy_backward(eph, epdlogp)
        for k in self.model: grad_buffer[k] += grad[k] # accumulate grad over batch

        # perform rmsprop parameter update every batch_size episodes
        if episode_number % batch_size == 0:
          for k,v in model.items():
            #updated .iteritems to .items to work with python3
            g = grad_buffer[k] # gradient
            rmsprop_cache[k] = decay_rate * rmsprop_cache[k] + (1 - decay_rate) * g**2
            model[k] += learning_rate * g / (np.sqrt(rmsprop_cache[k]) + 1e-5)
            grad_buffer[k] = np.zeros_like(v) # reset batch gradient buffer
      
        # boring book-keeping
        running_reward = reward_sum if running_reward is None else running_reward * 0.99 + reward_sum * 0.01
        
        if episode_number % batch_size == 1:
          cumulative_batch_rewards = reward_sum
          batch_average = reward_sum
        elif episode_number % batch_size == 0:
          cumulative_batch_rewards += reward_sum
          batch_average = cumulative_batch_rewards/batch_size
        else:
          cumulative_batch_rewards += reward_sum
          batch_average = cumulative_batch_rewards/(episode_number % batch_size)

        #print('resetting env. episode reward total was %f. running mean: %f' % (reward_sum, running_reward))
        #removed print for performance purposes
        
        if episode_number % 100 == 0: 
          pickle.dump(model, open('save2.p', 'wb'))
          #takes 15-20ms on macbook pro
        if episode_number % batch_size == 0: 
          with open('episode_file.csv', mode='w') as episode_file: #store the last episode
            episode_writer = csv.writer(episode_file, delimiter=',', quotechar='"', quoting=csv.QUOTE_MINIMAL)
            episode_writer.writerow([episode_number])
          with open('performance_file.csv', mode='a') as performance_file: #track performance over time
            performance_writer = csv.writer(performance_file, delimiter=',', quotechar='"', quoting=csv.QUOTE_MINIMAL)
            performance_writer.writerow([datetime.now(), episode_number, batch_average])
      
        reward_sum = 0

      observation = env.reset() # reset env
      prev_x = None
      
        #takes around 0.5ms on macbook pro
        # preprocess the observation, set input to network to be difference image
        cur_x = andrej_training.prepro(pixels)

        self.count += 1

        x = cur_x - self.prev_x if self.prev_x is not None else np.zeros(D)
        self.prev_x = cur_x

        # forward the policy network and sample an action from the returned probability
        aprob, h = policy_forward(x)
        move_up = True if np.random.uniform() < aprob else 3 # roll the dice!
      
        # record various intermediates (needed later for backprop)
        self.xs.append(x) # observation
        self.hs.append(h) # hidden state
        y = 1 if move_up == True else 0 # a "fake label"
        self.dlogps.append(y - aprob) # grad that encourages the action that was taken to be taken (see http://cs231n.github.io/neural-networks-2/#losses if confused)
        # step the environment and get new measurements
        
        observation, reward, done, info = env.step(action)

          reward_sum += reward
          self.drs.append(reward) # record reward (has to be done after we call step() to get reward for previous action)

        

          # if training:
            # if reward != 0: # Pong has either +1 or -1 reward exactly when game ends.
            # print('ep %d: game finished, reward: %f' % (episode_number, reward) + ('' if reward == -1 else ' !!!!!!!!'))
            # commented out above print statement for performance purposes

    @classmethod
    def sigmoid(request, x): 
      return 1.0 / (1.0 + np.exp(-x)) # sigmoid "squashing" function to interval [0,1]

    @classmethod
    def prepro(self,I):
      """ prepro 210x160x3 uint8 frame into 6400 (80x80) 1D float vector """
      image_array = np.asarray(I)
      a = image_array.reshape(320, 320, 3).astype('float32')
      a = cv2.cvtColor(cv2.resize(a,(80,80)), cv2.COLOR_BGR2GRAY)
     
      cv2.imwrite('color_img.jpg', a)
      # print(frame[0][frame != 0])
      print("this is the frame size", a.size)
      ret, a = cv2.threshold(a, 127, 255, cv2.THRESH_BINARY) # et is useless
      a[a == 255] = 1
      I = a.ravel()
      print(len(I))

      # if self.count == 20 :
      #   with open('final_file.csv', mode='w') as final_file: #store the pixels
      #         final_writer = csv.writer(final_file, delimiter=',', quotechar='"', quoting=csv.QUOTE_MINIMAL)
      #         final_writer.writerow(I)

      self.count += 1
      
      return I
    
    @classmethod
    def discount_rewards(r):
      """ take 1D float array of rewards and compute discounted reward """
      discounted_r = np.zeros_like(r)
      running_add = 0
      for t in reversed(range(0, r.size)):
      if r[t] != 0: running_add = 0 # reset the sum, since this was a game boundary (pong specific!)
          running_add = running_add * gamma + r[t]
          discounted_r[t] = running_add
          return discounted_r

      @classmethod
      def policy_forward(x):
       h = np.dot(model['W1'], x)
      h[h<0] = 0 # ReLU nonlinearity
          logp = np.dot(model['W2'], h)
          p = sigmoid(logp)
          return p, h # return probability of taking action 2, and hidden state

        @classmethod
        def policy_backward(eph, epdlogp):
          """ backward pass. (eph is array of intermediate hidden states) """
          dW2 = np.dot(eph.T, epdlogp).ravel()
          dh = np.outer(epdlogp, model['W2'])
          dh[eph <= 0] = 0 # backpro prelu
          dW1 = np.dot(dh.T, epx)
          return {'W1':dW1, 'W2':dW2}
        
        @classmethod
        def import_csv(csvfilename):
          data = []
          row_index = 0
          with open(csvfilename, "r", encoding="utf-8", errors="ignore") as scraped:
            reader = csv.reader(scraped, delimiter=',')
            for row in reader:
              data.append(row[0])
          return data

       




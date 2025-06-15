                  <img :src="player.t_shirt" :alt="player.surname" class="player-shirt">
                  <div class="player-info bench-info">
                    <span class="player-name bench-name">{{ player.surname }}</span>
                    <span v-if="player.is_captain" class="captain-badge">C</span>
                  </div>
                </div>
              </div>
            </div> 
<template>
  <div class="help-container">
    <div class="help-header">
      <h1>Помощь</h1>
      <div class="tab-buttons">
        <button 
          :class="['tab-button', { active: activeTab === 'faq' }]"
          @click="activeTab = 'faq'"
        >
          Частые вопросы
        </button>
        <button 
          :class="['tab-button', { active: activeTab === 'rules' }]"
          @click="activeTab = 'rules'"
        >
          Правила
        </button>
      </div>
    </div>

    <div class="help-content" v-if="activeTab === 'faq'">
      <div class="section">
        <h2>Фэнтези аккаунт</h2>
        <div class="faq-item">
          <div class="question" @click="toggleQuestion('signin')">
            <span>Я не могу войти. Что мне нужно сделать?</span>
            <i class="arrow" :class="{ down: !openQuestions.signin }"></i>
          </div>
          <div class="answer" v-if="openQuestions.signin">
            <p>Убедитесь, что вы используете правильный адрес электронной почты и пароль. Обратите внимание, что при вводе пароля учитывается регистр символов.</p>
            <p>Если вы зарегистрировались впервые в этом сезоне, вам необходимо активировать свой аккаунт перед тем, как создать команду в Фэнтези Высшей Лиги. На указанный при регистрации email будет отправлено письмо со ссылкой для активации аккаунта. Если вы не получили письмо, проверьте папки "Спам" или "Нежелательная почта".</p>
          </div>
        </div>
      </div>

      <div class="section">
        <h2>Выбор стартового состава</h2>
        <div class="faq-item">
          <div class="question" @click="toggleQuestion('teams')">
            <span>Могу ли я иметь более одной команды?</span>
            <i class="arrow" :class="{ down: !openQuestions.teams }"></i>
          </div>
          <div class="answer" v-if="openQuestions.teams">
            <p>В целях честной игры каждый пользователь может создать только одну команду. Вы можете зарегистрировать эту команду в нескольких лигах и соревноваться с разными группами друзей.</p>
          </div>
        </div>
        <div class="faq-item">
          <div class="question" @click="toggleQuestion('changes')">
            <span>Могу ли я вносить изменения в состав после начала игры?</span>
            <i class="arrow" :class="{ down: !openQuestions.changes }"></i>
          </div>
          <div class="answer" v-if="openQuestions.changes">
            <p>Да, вы можете делать неограниченное количество бесплатных замен до следующего дедлайна.</p>
          </div>
        </div>
      </div>

      <div class="section">
        <h2>Управление командой</h2>
        <div class="faq-item">
          <div class="question" @click="toggleQuestion('formation')">
            <span>Какие схемы я могу использовать?</span>
            <i class="arrow" :class="{ down: !openQuestions.formation }"></i>
          </div>
          <div class="answer" v-if="openQuestions.formation">
            <p>Вы можете использовать любую схему, при условии, что в составе всегда будет 1 вратарь, как минимум 3 защитника и как минимум 1 нападающий.</p>
          </div>
        </div>
        <div class="faq-item">
          <div class="question" @click="toggleQuestion('captain')">
            <span>Как поменять капитана?</span>
            <i class="arrow" :class="{ down: !openQuestions.captain }"></i>
          </div>
          <div class="answer" v-if="openQuestions.captain">
            <p>На странице "Моя команда" используйте меню, которое появляется при нажатии на игрока.</p>
          </div>
        </div>
      </div>
    </div>

    <div class="help-content" v-else>
      <div class="rules-section" v-for="(section, key) in ruleSections" :key="key">
        <div class="rules-header" @click="toggleRuleSection(key)">
          <h2>{{ section.title }}</h2>
          <i class="arrow" :class="{ down: !openRuleSections[key] }"></i>
        </div>
        <div class="rules-content" v-if="openRuleSections[key]">
          <div v-html="section.content"></div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const activeTab = ref('faq')
const openQuestions = ref({
  signin: false,
  teams: false,
  changes: false,
  formation: false,
  captain: false
})

const openRuleSections = ref({
  creation: false,
  management: false,
  transfers: false,
  chips: false,
  deadlines: false,
  scoring: false
})

const ruleSections = {
  creation: {
    title: 'Создание команды',
    content: `
      <div class="rules-subsection">
        <h3 style="font-weight: bold;">Размер состава</h3>
        <p class="description">Для участия в игре выберите команду из 15 игроков, в которую входят:</p>
        <ul class="player-list" style="list-style-type: disc; padding-left: 20px; margin-top: 10px;">
          <li style="margin-bottom: 5px;"><strong>2 вратаря</strong></li>
          <li style="margin-bottom: 5px;"><strong>5 защитников</strong></li>
          <li style="margin-bottom: 5px;"><strong>5 полузащитников</strong></li>
          <li style="margin-bottom: 5px;"><strong>3 нападающих</strong></li>
        </ul>
      </div>

      <div class="rules-subsection">
        <h3 style="font-weight: bold;">Бюджет</h3>
        <p class="description">На формирование состава вам доступно <strong>100 игровых единиц</strong>.</p>
      </div>

      <div class="rules-subsection">
        <h3 style="font-weight: bold;">Игроки из одного клуба</h3>
        <p class="description">Вы можете выбрать <strong>не более 3 игроков</strong> из одного клуба Высшей Лиги.</p>
      </div>
    `
  },
  management: {
    title: 'Управление составом',
    content: `
      <div class="rules-subsection">
        <h3 style="font-weight: bold;">Выбор стартового состава</h3>
        <p class="description">Из вашей 15-игроковой команды выберите 11 игроков до дедлайна игровой недели.</p>
        <p class="description">Все очки за игровую неделю будут начисляться этим 11 игрокам, но если кто-то из них не сыграет, возможна автоматическая замена.</p>
        <p class="description">Вы можете использовать любую расстановку при условии наличия 1 вратаря, минимум 3 защитников и минимум 1 нападающего.</p>
      </div>

      <div class="rules-subsection">
        <h3 style="font-weight: bold;">Выбор капитана и вице-капитана</h3>
        <p class="description">Из стартового состава назначьте капитана и вице-капитана. Очки капитана удваиваются.</p>
        <p class="description">Если капитан не сыграет ни минуты, капитаном станет вице-капитан.</p>
        <p class="description">Если ни капитан, ни вице-капитан не сыграют ни минуты, удвоения очков не будет.</p>
      </div>

      <div class="rules-subsection">
        <h3 style="font-weight: bold;">Приоритеты замен на скамейке</h3>
        <p class="description">Запасные игроки автоматически заменят тех, кто не сыграл (из-за травм, переносов и т.д.).</p>
        <p class="description">Участие в матче означает хотя бы 1 минуту на поле или получение карточки.</p>
        <p class="description">Автозамены происходят по правилам:</p>
        <ul style="list-style-type: disc; padding-left: 20px; margin-top: 10px;">
          <li style="margin-bottom: 5px;">Если вратарь не играл, его заменит запасной вратарь (если тот сыграл)</li>
          <li style="margin-bottom: 5px;">Полевые игроки заменяются запасными с наивысшим приоритетом, которые сыграли и не нарушают правила расстановки</li>
          <li style="margin-bottom: 5px;">Например: при 3 защитниках в основе, заменять можно только защитником</li>
        </ul>
      </div>
    `
  },
  transfers: {
    title: 'Трансферы',
    content: `
      <div class="rules-subsection">
        <h3 style="font-weight: bold;">Лимиты трансферов</h3>
        <p class="description">После формирования состава вы можете покупать и продавать игроков на трансферном рынке. До первого дедлайна можно совершать неограниченное количество бесплатных трансферов.</p>
        <p class="description">После первого дедлайна вы получаете 1 бесплатный трансфер каждую игровую неделю. Каждый дополнительный трансфер в той же неделе будет стоить 4 очка (вычитаются из вашего общего счёта).</p>
        <p class="description">Если вы не используете бесплатный трансфер, он переносится на следующую неделю. Максимальное количество накопленных бесплатных трансферов - 2.</p>
      </div>
      <div class="rules-subsection">
        <h3 style="font-weight: bold;">Цены игроков</h3>
        <p class="description">Цены игроков меняются в течение сезона в зависимости от их популярности на трансферном рынке. Изменения цен начинаются только после старта сезона.</p>
      </div>
    `
  },
  chips: {
    title: 'Чипы',
    content: `
      <div class="rules-subsection">
        <h3 style="font-weight: bold;">Использование чипов</h3>
        <p class="description">Чипы могут быть использованы для улучшения результатов вашей команды в течение сезона.</p>
        <p class="description">Только один чип может быть активирован в течение одной игровой недели. Доступные чипы:</p>
        
        <table style="width: 100%; border-collapse: collapse; margin-top: 10px;">
          <tr style="border-bottom: 1px solid #ddd;">
            <th style="padding: 8px; text-align: left; width: 40%;">Название</th>
            <th style="padding: 8px; text-align: left;">Эффект</th>
          </tr>
          <tr style="border-bottom: 1px solid #ddd;">
            <td style="padding: 8px;"><strong>Усиление скамейки</strong></td>
            <td style="padding: 8px;">Очки, заработанные запасными игроками, добавляются к вашему общему счету</td>
          </tr>
          <tr>
            <td style="padding: 8px;"><strong>Тройной капитан</strong></td>
            <td style="padding: 8px;">Очки вашего капитана утраиваются вместо удвоения</td>
          </tr>
        </table>
      </div>
    `
  },
  deadlines: {
    title: 'Дедлайны',
    content: `
      <div class="rules-subsection">
        <h3 style="font-weight: bold;">Сроки изменений</h3>
        <p class="description">Все изменения в составе (стартовый состав, трансферы, смена капитана, приоритеты замен) должны быть сделаны до дедлайна игровой недели, чтобы вступить в силу.</p>
        <p class="description">Дедлайны могут изменяться и обычно устанавливаются за 90 минут до начала первого матча игровой недели.</p>
      </div>
    `
  },
  scoring: {
    title: 'Подсчет очков',
    content: `
      <div class="rules-subsection">
        <h3 style="font-weight: bold;">Система начисления очков</h3>
        <p class="description">В течение сезона ваши игроки будут получать очки в зависимости от их выступлений в Премьер-лиге.</p>
        
        <table style="width: 100%; border-collapse: collapse; margin-top: 10px;">
          <tr style="border-bottom: 1px solid #ddd;">
            <th style="padding: 8px; text-align: left; width: 60%;">Действие</th>
            <th style="padding: 8px; text-align: left;">Очки</th>
          </tr>
          <tr style="border-bottom: 1px solid #ddd;">
            <td style="padding: 8px;">За игру до 60 минут</td>
            <td style="padding: 8px;">1</td>
          </tr>
          <tr style="border-bottom: 1px solid #ddd;">
            <td style="padding: 8px;">За игру 60 минут и более (без учета добавленного времени)</td>
            <td style="padding: 8px;">2</td>
          </tr>
          <tr style="border-bottom: 1px solid #ddd;">
            <td style="padding: 8px;">За каждый гол вратаря</td>
            <td style="padding: 8px;">10</td>
          </tr>
          <tr style="border-bottom: 1px solid #ddd;">
            <td style="padding: 8px;">За каждый гол защитника</td>
            <td style="padding: 8px;">6</td>
          </tr>
          <tr style="border-bottom: 1px solid #ddd;">
            <td style="padding: 8px;">За каждый гол полузащитника</td>
            <td style="padding: 8px;">5</td>
          </tr>
          <tr style="border-bottom: 1px solid #ddd;">
            <td style="padding: 8px;">За каждый гол нападающего</td>
            <td style="padding: 8px;">4</td>
          </tr>
          <tr style="border-bottom: 1px solid #ddd;">
            <td style="padding: 8px;">За каждую голевую передачу</td>
            <td style="padding: 8px;">3</td>
          </tr>
          <tr style="border-bottom: 1px solid #ddd;">
            <td style="padding: 8px;">За "сухой матч" вратаря или защитника</td>
            <td style="padding: 8px;">4</td>
          </tr>
          <tr style="border-bottom: 1px solid #ddd;">
            <td style="padding: 8px;">За "сухой матч" полузащитника</td>
            <td style="padding: 8px;">1</td>
          </tr>
          <tr style="border-bottom: 1px solid #ddd;">
            <td style="padding: 8px;">За каждые 3 сейва вратаря</td>
            <td style="padding: 8px;">1</td>
          </tr>
          <tr style="border-bottom: 1px solid #ddd;">
            <td style="padding: 8px;">За сейв пенальти</td>
            <td style="padding: 8px;">5</td>
          </tr>
          <tr style="border-bottom: 1px solid #ddd;">
            <td style="padding: 8px;">За промах с пенальти</td>
            <td style="padding: 8px;">-2</td>
          </tr>
          <tr style="border-bottom: 1px solid #ddd;">
            <td style="padding: 8px;">За каждые 2 пропущенных гола (вратарь/защитник)</td>
            <td style="padding: 8px;">-1</td>
          </tr>
          <tr style="border-bottom: 1px solid #ddd;">
            <td style="padding: 8px;">За желтую карточку</td>
            <td style="padding: 8px;">-1</td>
          </tr>
          <tr style="border-bottom: 1px solid #ddd;">
            <td style="padding: 8px;">За красную карточку</td>
            <td style="padding: 8px;">-3</td>
          </tr>
          <tr>
            <td style="padding: 8px;">За автогол</td>
            <td style="padding: 8px;">-2</td>
          </tr>
        </table>
      </div>

      <div class="rules-subsection">
        <h3 style="font-weight: bold;">Дополнительные правила</h3>
        <h4 style="font-weight: 600; margin-top: 15px;">"Сухой матч"</h4>
        <p class="description">Начисляется, если игрок не пропускал голы, находясь на поле и сыграв не менее 60 минут (без учета добавленного времени).</p>
        <p class="description">Если игрок был заменен до пропущенного гола, это не влияет на бонус за "сухой матч".</p>

        <h4 style="font-weight: 600; margin-top: 15px;">Красные карточки</h4>
        <p class="description">После получения красной карточки игрок продолжает терять очки за голы, пропущенные его командой.</p>
        <p class="description">Штраф за красную карточку включает штрафные очки за желтую карточку.</p>

        <h4 style="font-weight: 600; margin-top: 15px;">Голевые передачи</h4>
        <p class="description">Начисляются последнему игроку атакующей команды, коснувшемуся мяча перед голом. Это может быть намеренная передача, случайное касание или удар по воротам.</p>
        <p class="description">Если соперник значительно изменил направление мяча после последней передачи, передача не засчитывается. Также не засчитываются передачи после ошибок защиты или если бомбардир сам потерял и вернул мяч.</p>

        <h4 style="font-weight: 600; margin-top: 15px;">Отскоки</h4>
        <p class="description">Если после удара (блокированного защитником, отраженного вратарем или от штанги) забит гол, начисляется голевая передача. Удар не обязательно должен быть точным.</p>
        <p class="description">Если после отскока мяч значительно изменил направление из-за соперника, передача не засчитывается.</p>

        <h4 style="font-weight: 600; margin-top: 15px;">Автоголы</h4>
        <p class="description">Если игрок вынудил соперника забить автогол (ударом или передачей), начисляется голевая передача. При значительном изменении направления мяча передача не засчитывается.</p>

        <h4 style="font-weight: 600; margin-top: 15px;">Пенальти и штрафные</h4>
        <p class="description">При реализации пенальти или штрафного игрок, заработавший его, получает голевую передачу. Если исполнитель и заработавший - один игрок, передача не засчитывается.</p>

        <h4 style="font-weight: 600; margin-top: 15px;">Финальное начисление</h4>
        <p class="description">Очки могут корректироваться до часа после окончания последнего матча недели. После этого изменения возможны только в исключительных случаях.</p>
      </div>
    `
  }
}

const toggleQuestion = (key) => {
  openQuestions.value[key] = !openQuestions.value[key]
}

const toggleRuleSection = (key) => {
  openRuleSections.value[key] = !openRuleSections.value[key]
}
</script>

<style scoped lang="scss">
.help-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 3rem;
  background: linear-gradient(to bottom, #ffffff, #fafafa);
  border-radius: 16px;
  box-shadow: 0 8px 32px rgba(55, 0, 60, 0.08);
  position: relative;
  z-index: 1;
}

.help-header {
  text-align: center;
  margin-bottom: 3rem;
  position: relative;

  h1 {
    color: #37003c;
    font-size: 3rem;
    margin-bottom: 2rem;
    font-weight: 800;
    letter-spacing: -0.5px;
    text-transform: uppercase;
    background: linear-gradient(45deg, #37003c, #2d0066);
    -webkit-background-clip: text;
    background-clip: text;
    color: transparent;
    text-shadow: 2px 2px 4px rgba(0,0,0,0.1);
  }
}

.tab-buttons {
  display: flex;
  justify-content: center;
  gap: 1.5rem;
  margin-bottom: 2rem;
}

.tab-button {
  padding: 1rem 2.5rem;
  font-size: 1.2rem;
  font-weight: 700;
  color: #666;
  background: #f5f5f5;
  border: none;
  border-radius: 12px;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 2px 8px rgba(0,0,0,0.05);
  position: relative;
  z-index: 2;

  &:hover {
    background: #e8e8e8;
    transform: translateY(-2px);
  }

  &.active {
    background: linear-gradient(45deg, #37003c, #2d0066);
    color: white;
    box-shadow: 0 4px 12px rgba(55, 0, 60, 0.2);
  }
}

.section {
  margin-bottom: 3rem;
  position: relative;
  z-index: 2;

  h2 {
    color: #37003c;
    font-size: 1.8rem;
    margin-bottom: 1.5rem;
    padding-bottom: 0.8rem;
    font-weight: 700;
    border-bottom: 3px solid #00ff87;
    position: relative;

    &::after {
      content: '';
      position: absolute;
      bottom: -3px;
      left: 0;
      width: 60px;
      height: 3px;
      background: #37003c;
    }
  }
}

.faq-item {
  margin-bottom: 1.5rem;
  border: 1px solid rgba(55, 0, 60, 0.1);
  border-radius: 12px;
  overflow: hidden;
  transition: all 0.3s ease;
  box-shadow: 0 4px 12px rgba(0,0,0,0.03);
  position: relative;
  z-index: 2;

  &:hover {
    box-shadow: 0 6px 16px rgba(0,0,0,0.06);
    transform: translateY(-2px);
  }
}

.question {
  padding: 1.2rem 1.5rem;
  background: #f8f9fa;
  cursor: pointer;
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-weight: 600;
  font-size: 1.1rem;
  color: #37003c;
  transition: all 0.3s ease;
  position: relative;
  z-index: 3;

  &:hover {
    background: #f0f0f0;
  }

  .arrow {
    border: solid #37003c;
    border-width: 0 2px 2px 0;
    display: inline-block;
    padding: 4px;
    transform: rotate(-45deg);
    transition: transform 0.3s ease;
    margin-left: 1rem;
    position: relative;
    z-index: 4;

    &.down {
      transform: rotate(45deg);
    }
  }
}

.answer {
  padding: 1.5rem 2rem;
  background: white;
  border-top: 1px solid rgba(55, 0, 60, 0.1);
  color: #444;
  line-height: 1.7;
  font-size: 1.1rem;
  font-weight: 400;
  position: relative;
  z-index: 2;

  p {
    margin-bottom: 1rem;
    
    &:last-child {
      margin-bottom: 0;
    }
  }
}

.rules-section {
  margin-bottom: 1.5rem;
  background: white;
  border-radius: 16px;
  box-shadow: 0 4px 16px rgba(55, 0, 60, 0.06);
  transition: all 0.3s ease;
  border: 1px solid rgba(55, 0, 60, 0.08);
  position: relative;
  z-index: 2;

  &:hover {
    box-shadow: 0 6px 24px rgba(55, 0, 60, 0.1);
  }
}

.rules-header {
  padding: 1.5rem 2rem;
  cursor: pointer;
  display: flex;
  justify-content: space-between;
  align-items: center;
  position: relative;
  z-index: 3;
  
  h2 {
    color: #37003c;
    font-size: 1.8rem;
    font-weight: 700;
    margin: 0;
    border: none;
    padding: 0;

    &::after {
      display: none;
    }
  }

  .arrow {
    border: solid #37003c;
    border-width: 0 2px 2px 0;
    display: inline-block;
    padding: 6px;
    transform: rotate(-45deg);
    transition: transform 0.3s ease;
    margin-left: 1rem;
    position: relative;
    z-index: 4;

    &.down {
      transform: rotate(45deg);
    }
  }
}

.rules-content {
  padding: 2rem;
  color: #444;
  line-height: 1.8;
  font-size: 1.1rem;
  border-top: 1px solid rgba(55, 0, 60, 0.1);
  background: linear-gradient(to bottom, #ffffff, #fafafa);
  position: relative;
  z-index: 2;
  
  p {
    margin-bottom: 1.5rem;
    color: #37003c;
    font-size: 1.15rem;
    line-height: 1.8;
    text-shadow: 0 1px 1px rgba(255, 255, 255, 0.8);
    
    &:last-child {
      margin-bottom: 0;
    }
  }

  ul {
    margin: 1.2rem 0;
    padding-left: 1.5rem;
    
    li {
      margin-bottom: 1rem;
      position: relative;
      padding-left: 2rem;
      color: #37003c;
      font-size: 1.15rem;
      
      &:last-child {
        margin-bottom: 0;
      }

      &:before {
        content: '•';
        position: absolute;
        left: 0;
        color: #00ff87;
        font-size: 1.5rem;
        line-height: 1;
        text-shadow: 0 1px 2px rgba(0, 255, 135, 0.3);
      }
    }
  }
}

.rules-subsection {
  margin-bottom: 2.5rem;
  padding: 2rem;
  background: white;
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(55, 0, 60, 0.03);
  transition: all 0.3s ease;
  position: relative;
  z-index: 2;
  
  &:last-child {
    margin-bottom: 0;
  }

  &:hover {
    box-shadow: 0 6px 16px rgba(55, 0, 60, 0.06);
  }

  h3 {
    font-size: 1.6rem;
    font-weight: 800;
    color: #37003c;
    margin-bottom: 1.5rem;
    letter-spacing: -0.02em;
    position: relative;
    padding-left: 1rem;
    line-height: 1.2;

    &::before {
      content: '';
      position: absolute;
      left: 0;
      top: 0;
      bottom: 0;
      width: 4px;
      background: #00ff87;
      border-radius: 2px;
    }
  }

  .description {
    font-size: 1.2rem;
    line-height: 1.6;
    color: #37003c;
    margin-bottom: 1.5rem;
    font-weight: 500;

    strong {
      font-weight: 700;
      color: #2d0066;
      background: rgba(0, 255, 135, 0.15);
      padding: 0.2rem 0.5rem;
      border-radius: 4px;
    }
  }

  .player-list {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
    gap: 1rem;
    margin-top: 1rem;
  }

  .player-item {
    display: flex;
    align-items: center;
    gap: 1.2rem;
    padding: 1rem;
    background: #f8f9fa;
    border-radius: 10px;
    transition: all 0.3s ease;

    &:hover {
      background: #f0f0f0;
      transform: translateX(5px);
    }

    .player-number {
      font-size: 1.8rem;
      font-weight: 800;
      color: #37003c;
      background: #00ff87;
      min-width: 3rem;
      height: 3rem;
      display: flex;
      align-items: center;
      justify-content: center;
      border-radius: 8px;
      box-shadow: 0 2px 8px rgba(0, 255, 135, 0.3);
    }

    .player-type {
      font-size: 1.3rem;
      color: #37003c;
      font-weight: 600;
      letter-spacing: -0.01em;
    }
  }
}

/* Анимации */
.answer-enter-active,
.answer-leave-active {
  transition: all 0.3s ease;
  max-height: 500px;
  overflow: hidden;
}

.answer-enter-from,
.answer-leave-to {
  max-height: 0;
  opacity: 0;
  padding-top: 0;
  padding-bottom: 0;
}

.rules-content-enter-active,
.rules-content-leave-active {
  transition: all 0.3s ease;
  max-height: 2000px;
  overflow: hidden;
}

.rules-content-enter-from,
.rules-content-leave-to {
  max-height: 0;
  opacity: 0;
  padding-top: 0;
  padding-bottom: 0;
}
</style>

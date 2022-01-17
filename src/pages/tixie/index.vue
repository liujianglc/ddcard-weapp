<template>
  <view class="flex flex-col h-full">
    <count-down
      ref="countDown"
      :time="1 * 1000"
      format="ss:SSS"
      :auto-start="false"
      millisecond
      @change="onChange"
      @finish="onFinish"
    >
      <progress
        :percent="percent"
        show-info
        :stroke-width="2"
      />
    </count-down>
    <view class="mt-2 mb-6 px-8">
      <view class="flex items-center justify-end">
        <view
          class="flex items-center"
          @tap="handleFilter"
        >
          <image
            v-if="isNotStudied"
            :src="checkOnIcon"
            class="w-7 h-7"
          />
          <image
            v-else
            :src="checkIcon"
            class="w-7 h-7"
          />
          <text class="ml-2 text-lg text-gray-900 font-bold">
            {{ isRandom ? '随机' : '顺序' }}
          </text>
        </view>
      </view>
    </view>
    <view
      class="h-128 mx-2 py-12"
    >
      <view
        class="mx-auto h-full flex flex-col bg-gradient-to-b text-white rounded-xl transform duration-200 relative"
        :class="[
          'from-yellow-200 to-yellow-400'
        ]"
      >
        <view class="flex-1 flex flex-col items-center justify-center">
          <!-- <view
            v-if="isShowAnswer"
            class="mb-8"
            :animation="animationData"
            @tap="handlePlay"
          >
            <image
              :src="icon"
              class="w-48 h-48"
            />
          </view> -->
          <view class="text-center">
            <template v-if="mode === 'zh'">
              <view
                class="mb-2 text-4xl"
                :class="['text-yellow-900']"
              >
                <template v-if="isShowAnswer">
                  {{ (words[currentIdx] || {}).word }}
                </template>
              </view>
              <view class="text-4xl text-gray-900 font-bold capitalize">
                {{ ((words[currentIdx] || {}).group_words || [])
                  .map(g => g.replace(words[currentIdx].word, "~"))
                  .join(", ")
                }}
              </view>
            </template>
            <template v-else>
              <view class="mb-2 text-4xl text-gray-900 font-bold capitalize">
                {{ name }}
              </view>
              <view
                class="font-bold"
                :class="['text-yellow-900']"
              >
                {{ (words[currentIdx] || {}).word }}
              </view>
            </template>
          </view>
        </view>
        <view class="flex-shrink-0">
          <view class="py-8 h-24 flex flex-col items-center justify-between">
            <!-- <view
              class="py-3 w-2_3 rounded-full text-center text-gray-900 bg-white text-lg font-bold"
              @tap="handleStudied"
            >
              {{ isStudied ? '忘记了' : '学会了' }}
            </view> -->
            <view
              v-if="!isStudied"
              class="text-gray-900 text-sm"
              @tap="handleShowAnswer"
            >
              {{ isShowAnswer ? '隐藏答案' : '查看答案' }}
            </view>
          </view>
          <view class="p-5 text-center relative">
            <view class="text-lg">
              {{ currentIdx + 1 }} / {{ words.length }}
            </view>
          </view>
          <view class="absolute bottom-0 right-0 mb-4 mr-4 flex items-center">
            <image
              v-if="isVolumeUp"
              :src="volumeUpIcon"
              class="w-7 h-7"
            />
            <image
              v-else
              :src="volumeDownIcon"
              class="w-7 h-7"
            />
          </view>
        </view>
      </view>
    </view>
    <view
      v-if="words.length > 0"
      class="flex justify-center"
    >
      <view class="relative">
        <template v-if="isStarted">
          <view
            class="inline-flex items-center font-bold border-2 border-solid text-gray-900 border-gray-900 bg-yellow-400 rounded-xl shadow-gray py-1 px-4 text-xl"
            @tap="togglePause"
          >
            <text class="mr-0_5">
              {{ isPause ? '开始' : '暂停' }}
            </text>
            <image
              :src="arrowUpFillIcon"
              class="w-6 h-6 -mr-1"
            />
          </view>
        </template>
        <view
          v-else
          class="inline-flex items-center font-bold border-2 border-solid text-gray-900 border-gray-900 bg-yellow-400 rounded-xl shadow-gray py-1 px-4 text-xl"
          @tap="handleLearn"
        >
          <text class="mr-0_5">
            开始听写
          </text>
          <image
            :src="arrowUpFillIcon"
            class="w-6 h-6 -mr-1"
          />
        </view>
        <view
          v-show="dropShow"
          class="absolute origin-center bottom-full right-1_2 transform translate-x-1_2 mb-4 z-50"
        >
          <view class="w-36 rounded-xl border-2 border-solid border-gray-900 text-gray-900 bg-white text-center font-bold relative drop-menu animate-slideUp">
            <view
              class="py-3"
              @tap="handleTo('zh')"
            >
              中文
            </view>
            <view class="border border-solid border-gray-900" />
            <view
              class="py-3"
              @tap="handleTo('en')"
            >
              英文
            </view>
          </view>
        </view>
      </view>
    </view>
  </view>
  <!-- {{ words[currentIdx].word }} -->
  <!-- <count-down
      ref="countDown"
      :time="3* 1000"
      format="ss:SSS"
      :auto-start="false"
      millisecond
      @change="onChange"
      @finish="onFinish"
    />
    <progress
      :percent="percent"
      show-info
      :stroke-width="2"
    />
    {{ percent }}
    <button
      text="重置"
      size="normal"
      type="info"
      @tap="reset"
    >
      重置
    </button>
    <button
      text="开始"
      size="normal"
      type="success"
      @tap="start"
    >
      开始
    </button>
    <button
      text="暂停"
      size="normal"
      type="error"
      @tap="pause"
    >
      暂停
    </button> -->
</template>
<script>

import { getExamDetail } from "../../api/exam"
import CountDown from '../../components/countdown/index.vue'

import Taro from "@tarojs/taro"

import volumeDownIcon from "../../assets/img/icon/volume-down.svg"
import volumeUpIcon from "../../assets/img/icon/volume-up.svg"


import checkIcon from "../../assets/img/icon/check.svg"
import checkOnIcon from "../../assets/img/icon/check-on.svg"

import arrowUpFillIcon from "../../assets/img/icon/arrow-up-fill.svg"

import { apiPath } from '../../api/index'
const audioContext = Taro.createInnerAudioContext()


export default {
  components: {
    CountDown
  },
  onShow() {
    this.getExamDetail()
  },
  data() {
    return {
      currentIdx: 0,
      words: [],
      percent: 100,
      volumeUpIcon,
      volumeDownIcon,
      isStudied: false,
      isShowAnswer: false,
      mode: 'zh',
      name: '',
      checkIcon,
      checkOnIcon,
      isNotStudied: false,
      arrowUpFillIcon,
      dropShow: false,
      isRandom: false,
      isStarted: false,
      isPause: false,
      isVolumeUp: false,
      playStatus: false
    }
  },
  computed: {
    audioControl() {
      return this.currentIdx && this.isStarted && this.playStatus
    }
  },
  watch: {
    audioControl() {
      // this.playAudio()
    }
  },
  mounted() {
    Taro.eventCenter.on('playLearnAudio', (isForce) => {
      this.playAudio(isForce)
    })
  },
  methods: {
    buildLocalAudio(soundFile)  {
      return `${apiPath}/static/mp3/en/${soundFile}.mp3`;
    },
    buildAudioURL (text, { person = 0, spd = 3 }) {
      let currentWord = this.words[this.currentIdx]
      if (this.mode == 'zh') {
        console.log(currentWord.word);
        let gw = "";
        if (currentWord.group_words && currentWord.group_words.length > 0)
          gw = currentWord.group_words
            .filter(it => it != "")
            .map(item => item + "的" + (currentWord.fixed_word || currentWord.word))
            .join("、");

        let str = (currentWord.fixed_word || currentWord.word) + "、" + gw

        return `${apiPath}/text2audio?text=${encodeURIComponent(
          text || this.repeat(str, 2)
        )}&spd=${spd}&tick=${new Date().getTime()}&per=${person}`;
      } else {
        return this.buildLocalAudio(currentWord.sound)
      }
    },
    repeat (str, num) {
      let result = [];
      for (let i = 0; i < num; i++) {
        result.push(str);
      }
      return result.join("...、、、");
    },
    playAudio(text, isForce = false) {
      // let isLearned = this.mode === 'en' ? currentCard.en_is_learn : currentCard.zh_is_learn
      // if (!isLearned && !isForce) {
      //   return false
      // }
      // let src = this.mode === 'en' ? currentCard.en_audio_path_url : currentCard.zh_audio_path_url
      audioContext.src = this.buildAudioURL(text, {})

      // let that = this
      audioContext.offPlay()
      audioContext.onPlay(() => {
        this.playStatus = true
        // that.$set(that.cards[that.currentIndex], 'playStatus', true)
      })

      audioContext.offStop()
      audioContext.onStop(() => {
        // that.$set(that.cards[that.currentIndex], 'playStatus', false)
      })

      audioContext.offEnded()
      audioContext.onEnded(() => {
        console.log('onEnded: ')
        this.playStatus = false
        this.reset()
        this.$refs.countDown.start();
        // that.$set(that.cards[that.currentIndex], 'playStatus', false)
      })

      audioContext.onError(res => {
        console.log(res)
      })

      setTimeout(() => {
        audioContext.play()
      }, 200)
    },
    handleFilter() {

    },
    handleShowAnswer() {
      this.isShowAnswer = !this.isShowAnswer
    },
    handleStudied() {

    },
    start() {
      this.playAudio()
    },
    // 暂停
    pause() {
        this.$refs.countDown.pause();
    },
    togglePause() {
      if (this.isPause) {
        this.start()
      } else {
        this.pause()
        audioContext.stop()
      }
      this.isPause = !this.isPause
    },
    // 重置
    reset() {
        this.$refs.countDown.reset();
    },
    onChange(e) {
      // console.log(e)
      this.percent = e.totalSeconds/ 3000 * 100;
        // this.timeData = e
    },
    handleLearn() {
      this.isStarted = true
      this.currentIdx = 0
      this.percent = 100
      this.start()
    },

    onFinish() {
      console.log('finish')
      if (this.currentIdx == this.words.length - 1) {
        if (this.isStarted) {
          this.playAudio("听写结束, 请认真检查是否正确")
          this.isStarted = false
        }
        return
      }
      this.percent = 100
      this.currentIdx ++;
      this.start()
    },
    getExamDetail() {
      this.mode = Taro.getCurrentInstance().router.params.courseId == 1 ? 'zh': 'en'
      getExamDetail(Taro.getCurrentInstance().router.params.examId).then(res => {
        this.words = res.data
        // console.log(this.words)
      })
    }
  }
}
</script>

<template>
  <view class="flex flex-col">
    <view
      class="flex fixed w-full z-30"
      style="background-color: #35c3fa"
    >
      <view class="p-2 flex w-full ">
        <view class="">
          <image
            src="../../assets/logo.png"
            class="w-20 h-20 shadow-2xl rounded-full"
          />
        </view>
        <view class="flex-1 pl-1">
          <view class="flex justify-between items-center">
            <view
              class="text-white text-2xl"
              @tap="doLogin"
            >
              {{ userInfo.nickName || '听小兔' }}
            </view>
            <view class="flex">
              <button
                class="mb-4 inline-flex justify-center items-center box-border font-bold w-full border-2 border-solid text-gray-900 border-gray-900 bg-yellow-400 rounded-md py-1 px-4 text-xl"
                open-type="share"
              >
                分享
              </button>
              <button
                class="mb-4 ml-2 inline-flex justify-center items-center box-border font-bold w-full border-2 border-solid text-gray-900 border-gray-900 bg-yellow-400 rounded-md py-1 px-4 text-xl"
                open-type="contact"
              >
                反馈
              </button>
            </view>
          </view>
          <view class="text-black font-bold shadow-xl flex items-center border-bottom">
            <picker
              mode="multiSelector"
              range-key="name"
              :value="[selectOne, selectTwo, selectThree]"
              :range="dynPicker"
              @cancel="cancelChange"
              @change="bindMultiPickerChange"
              @columnChange="bindMultiPickerColumnChange"
            >
              <view class="picker">
                {{ courseName + gradeName + sectionName }} ({{ courseTypeName }})<image
                  :src="exchangeIcon"
                  class="w-4 h-4 ml-2"
                />
              </view>
            </picker>
          </view>
        </view>
      </view>
    </view>
    <view class="py-3 px-3 mb-12  mt-24 ">
      <template
        v-for="(lesson, idx) in lessons"
      >
        <template v-if="idx == 2">
          <ad
            :key="'ad-' + idx"
            unit-id="adunit-208e995305e2222c"
            class="mb-6"
          />
        </template>
        <view
          :key="lesson.id"
          class="border-solid border-gray-900 shadow-xl rounded-3xl mb-6 "
        >
          <view
            class="px-4 py-4 font-bold text-xl"
            @tap="lesson.display=!lesson.display"
          >
            {{ lesson.name }}. {{ lesson.title }}
          </view>
          <view
            v-if="lesson.display"
            class="pb-4"
          >
            <view
              v-if="lesson.common_words.length == 0 && lesson.group_words.length == 0"
              class="px-2 py-2 w-full flex box-border text-teal-400 justify-center"
            >
              该课无生字, 词语
            </view>
            <view
              v-if="lesson.common_words.length > 0"
              class="px-2 py-2 w-full flex box-border"
              @tap="toggleWords(lesson.common_words)"
            >
              <image
                v-if="lesson.common_words.filter(it => selected.includes(it.id)).length == lesson.common_words.length "
                :src="checkOnIcon"
                class="w-5 h-5"
              />
              <image
                v-else
                :src="checkIcon"
                class="w-5 h-5"
              />
              <text class="text-sm ml-2">
                {{ courseId == 1 ? '选择以下生字': '选择以下单词' }}
              </text>
            </view>
            <view
              class="flex flex-wrap"
            >
              <view
                v-for="word in lesson.common_words"
                :key="word.id"
              >
                <Words
                  :id="word.id"
                  :word="word.word"
                  :xiezi="word.xiezi == 1"
                  :selected="selected.includes(word.id)"
                  @toggle-selected="toggleSelected"
                />
              </view>
            </view>
            <view
              v-if="lesson.group_words.length > 0"
              class="px-2 py-2 w-full box-border flex items-center"
              @tap="toggleWords(lesson.group_words)"
            >
              <image
                v-if="lesson.group_words.filter(it => selected.includes(it.id)).length == lesson.group_words.length "
                :src="checkOnIcon"
                class="w-5 h-5"
              />
              <image
                v-else
                :src="checkIcon"
                class="w-5 h-5"
              />
              <text class="text-sm  ml-2">
                {{ courseId == 1 ? '选择以下词语': '选择以下句子' }}
              </text>
            </view>
            <view
              class="flex flex-wrap"
            >
              <view
                v-for="word in lesson.group_words"
                :key="word.id"
              >
                <Words
                  :id="word.id"
                  :word="word.word"
                  :xiezi="word.xiezi == 1"
                  :selected="selected.includes(word.id)"
                  @toggle-selected="toggleSelected"
                />
              </view>
            </view>
          </view>
        </view>
      </template>
    </view>


    <view class="fixed bottom-0 w-full text-center bg-white">
      <button
        class="inline-block w-60 my-4 mx-auto justify-center items-center box-border font-bold border-2 border-solid text-gray-900 border-gray-900 bg-white rounded-md py-1 px-4 text-xl"

        @tap="handleBegin"
      >
        开始听写 ({{ selected.length }}个)
      </button>
    </view>
    <view
      v-show="lockDialogShow"
      class="fixed z-10 inset-0 animate-fade"
    >
      <view class="flex items-center justify-center min-h-screen p-12 text-center animate-popup">
        <view
          class="fixed inset-0 bg-gray-700 bg-opacity-50 transition-opacity"
          @tap="closeLockDialog"
        />
        <view class="border-2 border-solid border-gray-900 flex flex-col rounded-xl shadow-sm bg-yellow-100 overflow-hidden w-full max-w-md mx-auto z-50">
          <view class="px-6 py-4 w-full box-border">
            <text class="font-bold text-xl">
              解锁卡片
            </text>
          </view>
          <view class="px-6 py-2 flex-grow w-full box-border">
            <swiper
              class="h-28 flex items-center"
              :autoplay="true"
              :interval="3000"
              :circular="true"
            >
              <swiper-item
                v-for="item in cards"
                :key="item.id"
              >
                <view class="flex items-center justify-center">
                  <image
                    :src="item.cover_url"
                    class="w-24 h-24"
                  />
                </view>
              </swiper-item>
            </swiper>
            <text class="text-yellow-900 text-xl font-bold">
              会员专属卡片
            </text>
          </view>
          <view class="px-6 py-4 w-full box-border">
            <button
              v-if="vipShow"
              class="mb-4 inline-flex justify-center items-center box-border font-bold w-full border-2 border-solid text-gray-900 border-gray-900 bg-yellow-400 rounded-md py-1 px-4 text-xl"
              @tap="handleUpgrade"
            >
              赞助会员，立即查看
            </button>
            <button
              class="inline-flex justify-center items-center box-border font-bold w-full border-2 border-solid text-gray-900 border-gray-900 bg-white rounded-md py-1 px-4 text-xl"
              @tap="handleUnlock"
            >
              免费试用1天
            </button>
          </view>
        </view>
      </view>
    </view>
  </view>
</template>

<script>
import Taro from "@tarojs/taro"
import { mapGetters, mapActions, mapState } from "vuex"
import GroupItem from "../../components/group/Item.vue"
import { getGroups, previewGroup } from "../../api/cardGroup"
import { storeUnlockRecord } from "../../api/unlockRecord"
import CountDown from '../../components/countdown/index.vue'
import Words from '../../components/words/index.vue'
import exchangeIcon from "../../assets/img/icon/exchange.svg"

import checkIcon from "../../assets/img/icon/check.svg"
import checkOnIcon from "../../assets/img/icon/check-on.svg"

import { createExam } from "../../api/exam"


export default {
  name: 'Index',
  components: {
    GroupItem,
    CountDown,
    Words
  },
  data () {
    return {
      groups: [],
      cards: [],
      lockDialogShow: false,
      currentGroup: null,
      percent: 100,
      selected: [],
      exchangeIcon,
      checkIcon,
      checkOnIcon,
      selectedPicker :[0,0,0],
      originalPicker: {},
      selectOne: 0,
      selectTwo: 0,
      selectThree: 0,
      dynPicker: []
    }
  },
  onShow() {
  },
  onHide() {
    this.closeLockDialog()
  },
  onShareAppMessage() {
    return {
      title: "快乐听写-" +  this.courseName + this.gradeName + this.sectionName +  `(${this.courseTypeName})`,
      path: `/pages/index/index?gradeId=${this.gradeId}&gradeName=${this.gradeName}&sectionName=${this.sectionName}&sectionId=${this.sectionId}&courseId=${this.courseId}&courseType=${this.courseType}`
    };
  },
  onLoad(options) {
    console.log(options)
    if (options) {
      this.$store.commit('lesson/SET_COURSE_TYPE', options['courseType'])
      this.$store.commit('lesson/SET_COURSE_ID', options['courseId'])
      this.$store.commit('lesson/SET_GRADE_ID', options['gradeId'])
      this.$store.commit('lesson/SET_SECTION_ID', options['sectionId'])
    }

    this.getSettings().then(res => {
      this.initPicker()
    })
    this.getGroups()
  },
  computed: {
    ...mapGetters({
      'userInfo': 'auth/userInfo',
      'vipShow': 'setting/vipShow',
      'gradeName': 'lesson/gradeName',
      'courseName': 'lesson/courseName',
      'courseTypeName': 'lesson/courseTypeName',
      'sectionName': 'lesson/sectionName',
    }),
    ...mapState('lesson', ['gradeId', 'courseId', 'sectionId', 'courseType']),
    ...mapState('setting',['picker', 'tipNote']),
    ...mapState('auth', ['userId', 'userInfo']),
    isVip() {
      return this.userInfo.is_vip || -1
    },
    lessons() {
      return this.$store.state.lesson.lessons
    }
  },
  mounted() {
    console.log(this.gradeId, this.courseId, this.sectionId, this.picker)
    // this.initPicker()
  },
  methods: {
    ...mapActions({
      'getUserInfo': 'auth/getUserInfo',
      'getSettings': 'setting/getGeneralSettings',
      'getLessonList': 'lesson/getLessonList',
    }),
    bindMultiPickerColumnChange(e) {
      this.$store.commit('lesson/RESET_LESSSONS')
      console.log(e.detail.column, e.detail.value)
      this.selectedPicker[e.detail.column] = e.detail.value

      switch(e.detail.column) {
        case 0:
          this.selectOne = e.detail.value
          this.$store.commit('lesson/SET_COURSE_TYPE', this.dynPicker[0][e.detail.value].key)
          if (this.dynPicker[0][e.detail.value].key == 2 ) {
            this.$store.commit('lesson/SET_COURSE_ID', 2)
          }
          break;
        case 1:
          this.selectTwo = e.detail.value
          this.$store.commit('lesson/SET_COURSE_ID', this.dynPicker[1][e.detail.value].course_id)
        break;
        case 2: {
          this.selectThree = e.detail.value
          const section = this.dynPicker[2][e.detail.value]
          this.$store.commit('lesson/SET_GRADE_ID', section.grade_id)
          this.$store.commit('lesson/SET_SECTION_ID', section.section_id)
          break;
        }
      }

      let courseKey = this.picker[0].find(it => it.key == this.courseType).key
      console.log(`courseKey=${courseKey}, courseId=${this.courseId}, gradeId=${this.gradeId}, selectedPicker=${JSON.stringify(this.selectedPicker)}`)

      const courseTypes = this.picker[0]
      const courses = this.picker[1].filter(it => it.key == courseKey)

      const sections = this.picker[2].filter(it => it.key == courseKey && (it.course_ids.filter(m => m == this.courseId).length > 0))
      this.dynPicker = [
        courseTypes,
        courses,
        sections
      ]
      console.log(this.dynPicker)
      this.fixIndex()
    },
    fixIndex() {
      let courseIdx = this.dynPicker[1].findIndex(it => it.key == this.courseType && it.course_id == this.courseId)
      // this.selectedPicker[1] =  courseIdx == -1 ? 0 : courseIdx
      let sectionIdx = this.dynPicker[2].findIndex(it => it.key == this.courseType && it.course_ids.filter(m => m == this.courseId).length > 0 &&  it.grade_id == this.gradeId && this.sectionId == it.section_id )
      // this.selectedPicker[2] = sectionIdx == -1 ? 0 : sectionIdx
      let courseTypeIdx = this.dynPicker[0].findIndex(it => it.key == this.courseType)
      this.selectOne = courseTypeIdx == -1 ? 0 : courseTypeIdx
      this.selectTwo = courseIdx == -1 ? 0 : courseIdx
      this.selectThree = sectionIdx == -1 ? 0 : sectionIdx

      this.$store.commit('lesson/SET_COURSE_ID', this.dynPicker[1][this.selectTwo].course_id)

      const section = this.dynPicker[2][this.selectThree]
      this.$store.commit('lesson/SET_GRADE_ID', section.grade_id)
      this.$store.commit('lesson/SET_SECTION_ID', section.section_id)
    },
    initPicker() {
      let courseKey = this.picker[0].find(it => it.key == this.courseType).key
      console.log(`courseKey=${courseKey}`)
      this.dynPicker = [
        this.picker[0],
        this.picker[1].filter(it => it.key == courseKey),
        this.picker[2].filter(it => it.key == courseKey && (it.course_ids.filter(m => m == this.courseId) > 0 )),
      ]
      this.fixIndex()
      console.log(this.selectedPicker)
      // this.selectedPicker = [this.selectOne, this.selectTwo, this.selectThree]
      this.originalPicker = { courseType: this.courseType, courseId: this.courseId, gradeId: this.gradeId, sectionId: this.sectionId, selectOne: this.selectOne, selectTwo: this.selectTwo, selectThree: this.selectThree}
    },
    bindMultiPickerChange() {
      this.originalPicker = { courseType: this.courseType, courseId: this.courseId, gradeId: this.gradeId, sectionId: this.sectionId, selectOne: this.selectOne, selectTwo: this.selectTwo, selectThree: this.selectThree}
      Taro.showLoading()
      this.getLessonList().then(() => {
        Taro.hideLoading()
      })
      console.log(JSON.stringify(this.originalPicker))
    },
    cancelChange() {
      console.log('cancel')
      console.log(JSON.stringify(this.originalPicker))
       this.$store.commit('lesson/SET_COURSE_TYPE', this.originalPicker['courseType'])
       this.$store.commit('lesson/SET_COURSE_ID', this.originalPicker['courseId'])
       this.$store.commit('lesson/SET_GRADE_ID', this.originalPicker['gradeId'])
       this.$store.commit('lesson/SET_SECTION_ID', this.originalPicker['sectionId'])
       this.initPicker()
    },
    toggleWords(words) {
      let mapIds = words.map(it => it.id)
      if(mapIds.filter(it => this.selected.includes(it)).length == words.length) {
        // 已经全在选择里面
        this.selected = this.selected.filter(it => !mapIds.includes(it))
      } else {
        this.selected = Array.from(new Set(this.selected.concat(mapIds)))
      }
    },
    toggleSelected(id) {
      console.log(id)
      let idx = this.selected.indexOf(id)
      if (idx == -1) {
        this.selected.push(id)
      } else {
        this.selected.splice(idx, 1)
      }
    },
    handleBegin() {
      if (this.selected.length < 1) {
        return
      }
      Taro.showLoading({
        title: '加载中',
      })

      createExam(this.userId, this.selected).then(res => {
        // log.info(`createExam response: ${JSON.stringify(res.data.data)}`);
        const { exam_id, exam_name } = res.data.data;
        Taro.hideLoading();
        Taro.navigateTo({
          url: `/pages/tixie/index?examId=${exam_id}&examName=${exam_name}&courseName=${this.courseName}&gradeName=${this.gradeName}&sectionName=${this.sectionName}&courseId=${this.courseId}&userId=${this.userId}`
        });
      });
    },
    getGroups() {
      this.getLessonList()
            .then(res => {
              this.groups = res.data
            })

      // this.getUserInfo()
      //   .finally(_ => {
      //     this.getLessonList()
      //       .then(res => {
      //         this.groups = res.data
      //       })
      //   })
    },
    handle(item) {
      if(!item.is_unlock) {
        Taro.showLoading({
          title: '加载中',
        })
        previewGroup(item.id)
          .then(res => {
            this.cards = res.data
            this.lockDialogShow = true
            this.currentGroup = item
          })
          .finally(() => {
            Taro.hideLoading()
          })

        return false
      }

      Taro.navigateTo({
        url: '/pages/detail/index?group_id=' + item.id
      })
    },
    closeLockDialog() {
      this.lockDialogShow = false
      this.currentGroup = null
    },
    handleUnlock() {
      storeUnlockRecord(this.currentGroup.id)
        .then(() => {
          this.getGroups()
        })
        .catch(err => {
          if (err.statusCode == 403) {
            Taro.showToast({
              title: err.data.message,
              icon: 'none'
            })
          }
        })
        .finally(_ => {
          this.closeLockDialog()
        })
    },
    doLogin() {
      if (this.userId.indexOf('-') == -1) {
        return;
      }
      this.handleTo('/pages/auth/index?redirect_url=' + encodeURIComponent('/pages/index/index'))
    },
    handleTo(url) {
      Taro.navigateTo({
        url: url
      })
    },
    handleUpgrade() {
      Taro.navigateTo({
        url: '/pages/vip/index'
      })
    }
  }
}
</script>

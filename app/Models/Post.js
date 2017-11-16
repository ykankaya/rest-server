'use strict'

const Model = require('./Model')
const User = use('App/Models/User')
const Course = use('App/Models/Course')
const Category = use('App/Models/Category')
const Config = use('Config')

module.exports = class Post extends Model {
  static get objectIDs() {
    return ['course_id', 'property_ids', 'user_id', '_id']
  }
  static get label() {
    return '一条'
  }
  static async fields() {
    return {
      _id: { sortable: true },
      
      course_id: {
        label: '所属专辑', type: 'select2', ref: "course.title", cols: 6,
        options: await use('App/Models/Course').options('_id', 'title'), searchable: true,
        sortable: true
      },
      user_id: {
        label: '所属专家', type: 'select2', ref: "user.username", cols: 6,
        options: await User.options('_id', 'username', { role_id: 1 }), searchable: true,
        sortable: true
      },
      title: { label: '标题', searchable: true, cols: 6, },
      is_book: { label: '是否为书', type: 'switch', cols: 3 },
      is_free: { label: '是否免费', type: 'switch', cols: 3, },

      category_ids: {
        label: '所属分类', type: 'select',
        ref: 'categories.name',
        multiple: true, 
        cols: 12,
        // size: 10,
        selectSize: 5,
        searchable: true,
        options: await Category.treeOptions('_id', 'name', '书籍分类'),
        showWhen: 'is_book'
      },
      
      image: { label: '图片', type: 'image', cols: 6, },
      voice: { label: '语音', type: 'audio', cols: 6, listable: false },
      description: { label: '描述', type: 'textarea', listable: false, cols: 12, },
      content: { label: '详情', type: 'html', listable: false, cols: 6, },
      created_at: { label: '创建时间' },
    }
  }

  getImage(val) {
    return this.uploadUri(val)
  }

  getVoice(val) {
    return this.uploadUri(val)
  }

  static get listFields() {
    return '_id course_id user_id category_ids title is_free image voice description created_at updated_at'.split(' ')
  }

  course() {
    return this.belongsTo('App/Models/Course', 'course_id', '_id').listFields()
  }

  user() {
    return this.belongsTo('App/Models/User', 'user_id', '_id').select(User.listFields)
  }

  categories() {
    return this.referMany('App/Models/Category', '_id', 'category_ids')
  }

  properties() {
    return this.referMany('App/Models/Property', '_id', 'property_ids')
  }

  comments() {
    return this.morphMany('App/Models/Comment', 'commentable_type', 'commentable_id').orderBy('-_id')
  }

}
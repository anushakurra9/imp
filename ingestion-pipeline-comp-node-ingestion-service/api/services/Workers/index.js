'use strict';

module.exports = {
    list: {
        school_creator: {
          enabled: true,
          dispatchQuery: {
            status: "submitted",
            type: "school",
            "progression.school": {$exists: false}
          },
          progression: {
            resultKey: "school",
            notificationEnabled: true,
            successMessage: "School has been created",
            errorMessage: "School creation failed",
            successStatus: "completed",
            failedStatus: "failed"
          }
        },
        class_creator: {
          enabled: true,
          dispatchQuery: {
            status: "submitted",
            type: {$in: ["coursesection"]},
            "progression.class": {$exists: false},
            $or: [
              {"progression.schoolId": {$exists: true}},
              {"metadata.schoolId": {$exists: true}}
            ]
          },
          progression: {
            resultKey: "class",
            notificationEnabled: true,
            successMessage: "Class has been created",
            errorMessage: "Class creation failed",
            successStatus: "completed",
            failedStatus: "failed"
          }
        },
        asset_creator: {
          enabled: true,
          dispatchQuery: {
            status: "submitted",
            type: {$in: ["asset"]},
            "progression.asset": {$exists: false},
            $or: [
              {"metadata.fileType": {$in: ["epub", "pdf"]}, "progression.book": {$exists: true}},
              {"metadata.fileType": {$nin: ["epub", "pdf"]}}
            ],
            $or: [
              {"progression.targetCDN": {$exists: true}},
              {"metadata.url": {$exists: true}}
            ]
          },
          progression: {
            resultKey: "asset",
            notificationEnabled: true,
            successMessage: "Asset has been created",
            errorMessage: "Asset creation failed",
            successStatus: "completed",
            failedStatus: "failed"
          }
        },
        rplus_ingest: {
          enabled: true,
          dispatchQuery: {
            status: "submitted",
            "metadata.fileType": {$in: ["epub", "pdf"]},
            "progression.asset": {$exists: false},
            "progression.book": {$exists: false},
            "progression.source": {$exists: true}
          },
          progression: {
            resultKey: "book",
            notificationEnabled: true,
            successMessage: "Book has been uploaded",
            errorMessage: "Book upload failed",
            successStatus: "submitted",
            failedStatus: "failed"
          }

        },
        asset_uploader: {
          enabled: true,
          dispatchQuery: {
            status: "submitted",
            "metadata.contentTypeValue": {$in: ["textbook", "booklet", "video", "audio", "scorm", "htm", "image", "misc. document", "project"]},
            "$or": [
              {"metadata.fileType": {$in: ["epub", "pdf"]}, "progression.book": {$exists: true}},
              {"metadata.fileType": {$nin: ["epub", "pdf"]}}
            ],
            "progression.asset": {$exists: false},
            "metadata.url": {$exists: false},
            "progression.source": {$exists: true},
            "progression.targetCDN": {$exists: false}
          },
          progression: {
            resultKey: "targetCDN",
            notificationEnabled: true,
            successMessage: "Asset has been uploaded",
            errorMessage: "Asset upload failed",
            successStatus: "submitted",
            failedStatus: "failed"
          }
        },
        cartridge_creator: {
          enabled: true,
          dispatchQuery: {
            status: "submitted",
            type: "cartridge",
            "progression.cartridge": {$exists: false}
          },
          progression: {
            resultKey: "cartridge",
            notificationEnabled: false,
            successMessage: "Cartridge has been created",
            errorMessage: "Cartridge creation failed",
            successStatus: "completed",
            failedStatus: "failed"
          }
        },
        cartridge_asset_creator: {
          enabled: true,
          dispatchQuery: {
            status: "submitted",
            type: "cartridge-asset",
            "progression.cartridgeId": {$exists: true},
            "progression.assetId": {$exists: true},
            "progression.cartridgeAsset": {$exists: false}
          },
          progression: {
            resultKey: "cartridgeAsset",
            notificationEnabled: false,
            successMessage: "Asset mapped to cartridge",
            errorMessage: "Asset mapping to cartridge failed",
            successStatus: "completed",
            failedStatus: "failed"
          }
        },
        cartridge_school_creator: {
          enabled: true,
          dispatchQuery: {
            status: "submitted",
            type: "cartridge-school",
            "progression.cartridgeId": {$exists: true},
            "progression.schoolId": {$exists: true},
            "progression.cartridgeSchool": {$exists: false}
          },
          progression: {
            resultKey: "cartridgeSchool",
            notificationEnabled: false,
            successMessage: "School mapped to cartridge",
            errorMessage: "School mapping to cartridge failed",
            successStatus: "completed",
            failedStatus: "failed"
          }
        },
        course_creator: {
          enabled: true,
          dispatchQuery: {
            status: "submitted",
            type: "course",
            "progression.course": {$exists: false}
          },
          progression: {
            resultKey: "course",
            notificationEnabled: true,
            successMessage: "Course has been created",
            errorMessage: "Course creation failed",
            successStatus: "completed",
            failedStatus: "failed"
          }
        },
        course_cartridge_creator: {
          enabled: true,
          dispatchQuery: {
            status: "submitted",
            type: "course-cartridge",
            "progression.cartridgeId": {$exists: true},
            "progression.courseId": {$exists: true},
            "progression.courseCartridge": {$exists: false}
          },
          progression: {
            resultKey: "courseCartridge",
            notificationEnabled: false,
            successMessage: "Course mapped to cartridge",
            errorMessage: "Course mapping to cartridge failed",
            successStatus: "completed",
            failedStatus: "failed"
          }
        },
        course_school_creator: {
          enabled: true,
          dispatchQuery: {
            status: "submitted",
            type: "course-school",
            "progression.schoolId": {$exists: true},
            "progression.courseId": {$exists: true},
            "progression.courseSchool": {$exists: false}
          },
          progression: {
            resultKey: "courseSchool",
            notificationEnabled: false,
            successMessage: "Course mapped to school",
            errorMessage: "Course mapping to school failed",
            successStatus: "completed",
            failedStatus: "failed"
          }          
        },
        user_creator: {
          enabled: true,
          dispatchQuery: {
            status: "submitted",
            type: {$in: ["user"]},
            "progression.user": {$exists: false}
          },
          progression: {
            resultKey: "user",
            notificationEnabled: false,
            successMessage: "User created",
            errorMessage: "User creation failed",
            successStatus: "completed",
            failedStatus: "failed"
          }          
        },
        school_user_creator: {
          enabled: true,
          dispatchQuery: {
            status: "submitted",
            type: {$in: ["school-user"]},
            "progression.schoolId": {$exists: true},
            "progression.userId": {$exists: true},
            "progression.schoolUser": {$exists: false}
          },
          progression: {
            resultKey: "schoolUser",
            notificationEnabled: false,
            successMessage: "User registered to school",
            errorMessage: "User registration to school failed",
            successStatus: "completed",
            failedStatus: "failed"
          }          
        }
      }
}
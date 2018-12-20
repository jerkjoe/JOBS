import io from 'socket.io-client'
import axios from 'axios'
const socket = io('ws://localhost:9093')

// chat list
const MSG_LIST = 'MSG_LIST'

// Receive message
const MSG_RECV = 'MSG_RECV'

// READ MESSAGE
const MSG_READ = 'MSG_READ'

const initState = {
    chatmsg: [],
    unread: 0,
    users: {}
}

export function chat(state = initState, action) {
    switch (action.type) {
        case MSG_LIST:
            return {
                ...state,
                chatmsg: action.payload.msgs,
                unread: action.payload.msgs.filter(el => !el.read).length,
                users: action.payload.users
            }
        case MSG_RECV:
            return {
                ...state,
                chatmsg: [...state.chatmsg, action.payload],
                unread: state.unread + 1
            }
        case MSG_READ:
            return
        default:
            return state
    }
}

function msgList(msgs, users) {
    return {
        type: MSG_LIST,
        payload: { msgs, users }
    }
}

function msgRecv(data) {
    return {
        type: MSG_RECV,
        payload: data
    }
}
export function getMsgList() {
    return dispatch => {
        axios.get('/user/getmsglist').then(res => {
            if (res.status === 200 && res.data.code === 0) {
                dispatch(msgList(res.data.msgs, res.data.users))
            }
        })
    }
}

export function recvMsg(data) {
    return dispatch => {
        socket.on('recvmsg', function(data) {
            console.log(data)
            dispatch(msgRecv(data))
        })
    }
}
export function sendMsg({ from, to, msg }) {
    return dispatch => {
        socket.emit('sendmsg', {
            from,
            to,
            msg
        })
    }
}

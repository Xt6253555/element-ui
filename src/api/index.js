import request from '../utils/request';

export default {
    search(page, size,searchMap) {
        return request({
            url: `/enterprise/search/${page}/${size}`,
            method:'post',
            params:searchMap
        })
    },
    save(pojo) {
        return request({
            url: `/enterprise`,
            method: 'post',
            params: pojo
        })
    },
    findById(id) {
        return request({
            url: `/enterprise/${id}`,
            method: 'get'
        })
    },
    update(id, pojo) {
        if (id == null || id == '') {
            return this.save(pojo)
        }
        return request({
            url: `/enterprise/${id}`,
            method: 'put',
            params: pojo
        })
    },
    deleteById(id) {
        return request({
            url: `/enterprise/${id}`,
            method: 'delete'
        })
    }
}


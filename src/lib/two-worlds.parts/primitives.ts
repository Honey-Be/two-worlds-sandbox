export class PropertiesRegistry {
    private inner: Map<number, {ownerEmail: string; count: number}>
    public constructor() {
        this.inner = new Map<number, {ownerEmail: string; count: number}>()
    }
    public search(cellId: number): {ownerEmail: string | null, count: number} {
        const search_for = this.inner.get(cellId)
        if(search_for === undefined) {
            return {
                ownerEmail: null,
                count: 0
            }
        } else {
            return search_for
        }
    }
    public construct(cellId: number, count_to_construct: number = 1, playerEmail?: string) {
        const {ownerEmail, count} = this.search(cellId)
        if(count_to_construct === 0) {
            return;
        }
        if(ownerEmail === null) {
            if(playerEmail === undefined) {
                return;
            } else {
                count_to_construct = Math.floor(count_to_construct)
                if(count_to_construct < 1) {
                    return;
                } else {
                    this.inner.set(cellId, {ownerEmail: playerEmail, count: Math.min(3, count_to_construct)})
                }
            }
        } else {
            if(playerEmail === undefined) {
                const new_count = Math.min(3,count + Math.floor(count_to_construct))
                if (new_count <= 0) {
                    this.inner.delete(cellId)
                } else {
                    this.inner.set(cellId, {ownerEmail, count: new_count})
                }
                
            }
        }
    }
    public static copy(orig: PropertiesRegistry) {
        const copied = new PropertiesRegistry()
        orig.inner.forEach((value, key) => copied.inner.set(key, value))
        return copied
    }
    
    public static from(data: {ownerEmail: string, count: number, cellId: number}[]) {
        const result = new PropertiesRegistry()
        for(const {ownerEmail, count, cellId} of data) {
            result.construct(cellId, count, ownerEmail)
        }
        return result
    }
}

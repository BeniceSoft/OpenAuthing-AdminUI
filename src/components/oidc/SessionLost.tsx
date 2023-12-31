
export default () => {

    return (
        <div className="w-screen h-screen flex items-center">
            <div className="mx-auto">
                <h2 className="text-red-600 text-lg mb-2">会话失效</h2>
                <p className="text-gray-600">
                    当前会话已经过期，请
                    <span className="text-blue-600 cursor-pointer" onClick={() => location.reload()}>刷新</span>
                </p>
            </div>
        </div>
    )
}
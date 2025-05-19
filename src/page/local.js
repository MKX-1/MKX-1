//这里先当作中转站    
 <svg viewBox="0 0 1500 400" preserveAspectRatio="none" fill="currentColor">
        <path id="wave" d="M 0 2000 0 300 Q 120 220 300 300 t 300 0 300 0 300 0 300 0 300 0 v400 z"></path>
        <path id="wave-path" d="M -600 0 0 0" />
        <g id="waves-container"></g>
</svg>
const container = document.getElementById('waves-container')
const svgNS = "http://www.w3.org/2000/svg"
const randColor = () => {
    return `rgba(${Math.random() * 50 + 50},
    ${Math.random() * 100 + 150},
    ${Math.random() * 50 + 200}
    ,${(Math.random() * 0.3 + 0.2).toFixed(2)})`
}
const randDuration = () => {
    return `${(Math.random() * 20 + 3).toFixed(1)}s`
}
const randPos = i => ({
    x: Math.random() * 100 - 50,
    y: -5 - i * 3 + Math.random() * 8 - 4,
})
const createWaveElement = (wave) => {
    const use = document.createElementNS(svgNS, 'use')
    use.setAttributeNS(null, 'href', '#wave');
    use.setAttributeNS(null, 'x', wave.x);
    use.setAttributeNS(null, 'y', wave.y);
    use.setAttributeNS(null, 'fill', wave.fill);
    use.setAttributeNS(null, 'opacity', wave.opacity);

    const animate = document.createElementNS(svgNS, 'animateMotion')
    animate.setAttributeNS(null, 'dur', wave.duration)
    animate.setAttributeNS(null, 'repeatCount', 'indefinite')
    const mpath = document.createElementNS(svgNS, 'mpath')
    mpath.setAttributeNS(null, 'href', '#wave-path')
    animate.appendChild(mpath)
    use.appendChild(animate)
    return use;
}
Array.from({ length: 20 }, (_, i) => {
    const { x, y } = randPos(i);
    const wave = {
        x,
        y,
        fill: randColor(),
        opacity: `${Math.floor(Math.random() * 70 + 5)}%`,
        duration: randDuration(),
    }
    const waveElement = createWaveElement(wave);
    if (container) {
        container.appendChild(waveElement);
    }
})
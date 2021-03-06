export default function createStatementData(invoice, plays) {
    const statementData = {};
    statementData.customer = invoice.customer;
    statementData.performances = invoice.performances.map(enrichPerformance);
    statementData.totalAmount = totalAmount(statementData);
    statementData.totalVolumeCredits = totalVolumeCredits(statementData);
    return statementData

    function enrichPerformance(aPerformance) {
        const play = playFor(aPerformance);
        return {
            ...aPerformance,
            play,
            amount: amountFor(aPerformance, play),
            volumeCredits: volumeCreditsFor(aPerformance, play),
        };
    }
    
    function playFor(aPerformance) {
        return plays[aPerformance.playID];
    }
    
    function amountFor(aPerformance, play) {
        let result = 0;
    
        switch (play.type) {
            case 'tragedy':
            result = 40000;
            if (aPerformance.audience > 30) {
                result += 1000 * (aPerformance.audience - 30);
            }
            break;
            case 'comedy':
            result = 30000;
            if (aPerformance.audience > 20) {
                result += 10000 + 500 * (aPerformance.audience - 20);
            }
            result += 300 * aPerformance.audience;
            break;
            default:
            throw new Error(`unknown type: ${play.type}`);
        }
        return result;
    }
    
    function volumeCreditsFor(aPerformance, play) {
        let result = 0;
        result += Math.max(aPerformance.audience - 30, 0);
        if ('comedy' === play.type)
            result += Math.floor(aPerformance.audience / 5);
        return result;
    }
    
    function totalAmount(data) {
        return data.performances.reduce((total, p) => total + p.amount, 0);
    }
    
    function totalVolumeCredits(data) {
        return data.performances.reduce((total, p) => total + p.volumeCredits, 0);
    }
}

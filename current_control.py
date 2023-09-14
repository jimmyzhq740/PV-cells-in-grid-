import time
import urequests
import network
from machine import Pin, ADC, PWM

vret_pin = ADC(Pin(26))
vout_pin = ADC(Pin(28))
vin_pin = ADC(Pin(27))
pwm = PWM(Pin(0))
pwm.freq(100000)
pwm_en = Pin(1, Pin.OUT)

i_ref = 100.0  # mA
vref = 2.5
vin = 0.0
vout = 0.0
iout_mA = 0.0
count = 0
pwm_out = 0
pwm_per = 0.0  # in percentage

def saturate(duty):
    if duty > 62500:
        duty = 62500
    if duty < 100:
        duty = 100
    return duty

def sampling(vin_pin, vout_pin, vret_pin, pwm_out):
    vin = vin_pin.read_u16() * (12500 / 2500) * (3.3 / 65535)
    vout = vout_pin.read_u16() * (12500 / 2500) * (3.3 / 65535)
    iout_mA = 1000 * vret_pin.read_u16() * (3.3 / 65535) / 1.02
    pwm_out = saturate(pwm_out)
    pwm_per = (pwm_out / 65535) * 100
    return vin, vout, iout_mA, pwm_per, pwm_out

ssid = 'Ethan'
password = 'asdfghjkl'

wlan = network.WLAN(network.STA_IF)
wlan.active(True)
wlan.connect(ssid, password)

# Wait for connection or fail
max_wait = 20
while max_wait > 0:
    if wlan.status() == network.STAT_GOT_IP:
        break
    max_wait -= 1
    time.sleep(1)

if wlan.status() != network.STAT_GOT_IP:
    raise RuntimeError('Failed to connect to WiFi')

print('Connected to WiFi')
print('IP address:', wlan.ifconfig()[0])

api_endpoint = 'http://18.207.219.58:3100/update'

while True:
    count += 1
    pwm_en.value(1)
    vin, vout, iout_mA, pwm_per, pwm_out = sampling(vin_pin, vout_pin, vret_pin, pwm_out)
    pwm.duty_u16(pwm_out)

    #Currenr Control Scheme
    if iout_mA >= 280:
        pwm_per = pwm_per / 10
        pwm_out = round((pwm_per / 100) * 65535)
        pwm.duty_u16(pwm_out)
    elif iout_mA - i_ref > 5:
        pwm_per -= 0.01
        pwm_out = round((pwm_per / 100) * 65535)
        pwm.duty_u16(pwm_out)
    elif iout_mA - i_ref < -0.05:
        pwm_per += 0.01
        pwm_out = round((pwm_per / 100) * 65535)
        pwm.duty_u16(pwm_out)
    else:
        pwm.duty_u16(pwm_out)

    if count > 2000:
        print("Vin = {:.2f}V".format(vin))
        print("Vout = {:.2f}V".format(vout))
        print("Iout = {:.2f}mA".format(iout_mA))
        print("Duty = {:.2f}%".format((pwm_out / 65535) * 100))
        payload = {
            'Colour': "Yellow",
            'Vin': str(vin),
            'Vout': str(vout),
            'Iout': str(iout_mA),
            'Duty': "{:.2f}%".format((pwm_out / 65535) * 100)
        }

        response = urequests.post(api_endpoint, json=payload) #告诉API应该怎么发过来，和要发什么东西，发到后端（后端相当于是个处理器） payload 就是以jason 格式写的，跟python的dict一样，传过去的东西就是在后端中的req，req所处的位置就是代表从一个发射端发过来的信息，不管是不是req的名字

        response.close()
        count = 0

        #con.query 就是从后端发送信息大database
        #/personquery 指的是从index 里面从端口里截取personquery 那部分的东西，发到前段